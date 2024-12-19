import {EntityManager} from "@/core/managers/EntityManager";
import {Campaign} from "@/models/Campaign";
import {FormError} from "@/core/utils/operation_result/FormError";
import {OperationResult} from "@/core/utils/operation_result/OperationResult";
import {Donation} from "@/models/Donation";
import {Donor} from "@/models/Donor";
import {SimpleError} from "../utils/operation_result/SimpleError";
import {Constraint} from "../repository/Constraint";
import {Operator} from "../repository/Operator";
import {TotalDonatedValue} from "@/models/TotalDonatedValue";
import {RepositoryAsync} from "../repository/RepositoryAsync";
import {PrimaryKeyPart} from "../repository/PrimaryKeyPart";
import { DonationCampaignManager } from "./DonationCampaignManager";
import { IncludeNavigation } from "../repository/IncludeNavigation";
import { Badge } from "@/models/Badge";
import { CampaignBadge } from "@/models/CampaignBadge";
import { NotificationManager } from "./NotificationManager";
import { RetransmissionEvent } from "@/services/hubs/events/RetransmissionEvent";
import { RoomIdGenerator } from "@/services/hubs/notificationHub/RoomIdGenerator";
import { NewBadgeUnlocked } from "@/models/notifications/NewBadgeUnlocked";
import { DonorBadge } from "@/models/DonorBadge";
import { BadgeTypes } from "@/models/types/BadgeTypes";
import { EventNotification } from "@/services/hubs/events/EventNotification";
import { Notification } from "@/models/Notification";

export class DonationManager extends EntityManager<Donation> 
{
    private readonly totalDonatedValueRepo : RepositoryAsync<TotalDonatedValue>;
    private readonly donorRepo : RepositoryAsync<Donor>;
    private readonly campaignManager : DonationCampaignManager;
    private readonly donorBadgesRepo: RepositoryAsync<DonorBadge>;

    constructor() 
    {
        super(Donation);
        this.totalDonatedValueRepo = new RepositoryAsync(TotalDonatedValue);
        this.donorRepo = new RepositoryAsync(Donor);
        this.campaignManager = new DonationCampaignManager();
        this.donorBadgesRepo = new RepositoryAsync(DonorBadge);
    }

    getDonacoinsPerDonationFactor() : number
    {
        return 100;
    }

    async create(campaignId:number, donorId:number, comment:string, value:number, isNameHidden:boolean): Promise<OperationResult<Donation | null, FormError>> 
    {
        const donation = new Donation();
        donation.campaign_id = campaignId;
        donation.donor_id = donorId;
        donation.comment = comment;
        donation.value = value;
        donation.is_name_hidden = isNameHidden;

        const errors: FormError[] = [];

        if (donation.donor_id) {
            const donorManager = new EntityManager(Donor);
            const donorExists = await donorManager.exists(donation.donor_id);
            if (!donorExists) {
                errors.push(new FormError("donor_id", ["Donor does not exist"]));
            }
        }

        let campaign:Campaign | null;
        if (donation.campaign_id) {
            campaign = await this.campaignManager.getById(donation.campaign_id,
                (campaign)=>[new IncludeNavigation(campaign.badges,0),
                    new IncludeNavigation((new CampaignBadge).badge,1)
                ]);
            
            if (!campaign) {
                errors.push(new FormError("campaign_id", ["Campaign does not exist"]));
            }
        }

        if(errors.length != 0 )
            return new OperationResult(null, errors);

        const createdDonation = await this.add(donation);
        this.updateTotalDonatedValue(createdDonation.donor_id!,campaign!,createdDonation.value!);
        this.updateDonorTotalDonatedValue(createdDonation.donor_id!,createdDonation.value!);
        campaign!.current_donation_value! += createdDonation.value!;
        this.campaignManager.updateField(campaign!,["current_donation_value"]);

        return new OperationResult(createdDonation, errors);
    }

    private async updateTotalDonatedValue(donor_id:number,campaign:Campaign,donatedValue:number)
    {
        let totalDonatedValue = await this.totalDonatedValueRepo.getFirstByCondition(
            [new Constraint("donor_id",Operator.EQUALS,donor_id),new Constraint("campaign_id",Operator.EQUALS,campaign.id)],
            (u)=>[],
            [],0,0
        )

        if( totalDonatedValue != null)
        {
            totalDonatedValue.total_value! += donatedValue;
            await this.totalDonatedValueRepo.updateFields(totalDonatedValue,"total_value");
            
        }
        else
        {
            totalDonatedValue = new TotalDonatedValue();
            totalDonatedValue.campaign_id = campaign.id;
            totalDonatedValue.donor_id = donor_id;
            totalDonatedValue.total_value = donatedValue;
            this.totalDonatedValueRepo.create(totalDonatedValue);

            const notificationManager = new NotificationManager()

            const  donotBadge = new DonorBadge();
            const unlockedBadge = (campaign.badges.value! as CampaignBadge[])
                                    .find( (campaignBadge:CampaignBadge) => (campaignBadge.badge.value as Badge).type === BadgeTypes.CampaignHelper)?.badge.value as Badge 
            donotBadge.badge_id = unlockedBadge.id
            donotBadge.donor_id = donor_id;
            donotBadge.unblock_at = new Date();
            const notification:Notification = new NewBadgeUnlocked(donor_id,unlockedBadge!);

            this.donorBadgesRepo.create(donotBadge);

            notificationManager.hubConnection.addAfterConnectionHandler(
                ()=>
                {
                    notificationManager.hubConnection.emitEvent(
                        new RetransmissionEvent( 
                            { 
                                toConnection:null,
                                toRom:RoomIdGenerator.generateUserRoom(donor_id),
                                originalEvent:new EventNotification(notification)
                            }
                        )
                    )

                }
            )
            
        }
    }

    private async updateDonorTotalDonatedValue(donor_id:number,donatedValue:number)
    {
        const donor = await this.donorRepo.getByPrimaryKey([new PrimaryKeyPart("id",donor_id)]) as Donor;
        donor.total_donated_value! += donatedValue;
        donor.total_donations! += 1;
        donor.donacoins! += donatedValue*100;
   
        let endDate = new Date(donor.frequency_of_donation_datetime!);
        endDate.setHours(endDate.getHours() + 168);

        const dateNow = new Date();
        if( dateNow > endDate )
            donor.frequency_of_donation! += 1;
        else
        {
            donor.frequency_of_donation = 1;
            donor.frequency_of_donation_datetime = dateNow;
        }

        if(donor.frequency_of_donation! > donor.best_frequency_of_donation!)
        {
            donor.best_frequency_of_donation = donor.frequency_of_donation
            donor.best_frequency_of_donation_datetime = dateNow;
        }

        this.donorRepo.updateFields(donor,
            "donacoins",
            "total_donated_value",
            "total_donations",
            "frequency_of_donation",
            "frequency_of_donation_datetime",
            "best_frequency_of_donation",
            "best_frequency_of_donation_datetime"
        );
    }

    async getDonationsOfDonor(donor_id:number, page:number, pageSize:number): Promise< OperationResult< Donation[]| null,SimpleError> >
    {
        const donations = await this.repository.getByCondition(
            [new Constraint("donor_id",Operator.EQUALS,donor_id)],
            (d)=>[],
            [{ column: `${Donation.getTableName()}.id`, order: "desc" }],
            pageSize,
            page*pageSize,
        )

        if( donations.length == 0)
            return new OperationResult(null,[new SimpleError("No results where fount.")]);
        else
            return new OperationResult(donations,[]);
    }
}
