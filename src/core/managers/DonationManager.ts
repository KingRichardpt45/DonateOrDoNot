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

export class DonationManager extends EntityManager<Donation> 
{
    private readonly totalDonatedValueRepo : RepositoryAsync<TotalDonatedValue>;
    private readonly donorRepo : RepositoryAsync<Donor>;
    private readonly campaignManager : DonationCampaignManager;

    constructor() 
    {
        super(Donation);
        this.totalDonatedValueRepo = new RepositoryAsync(TotalDonatedValue);
        this.donorRepo = new RepositoryAsync(Donor);
        this.campaignManager = new DonationCampaignManager();
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
            
            campaign = await this.campaignManager.getById(donation.campaign_id);
            if (!campaign) {
                errors.push(new FormError("campaign_id", ["Campaign does not exist"]));
            }
        }

        if(errors.length != 0 )
            return new OperationResult(null, errors);

        const createdDonation = await this.add(donation);
        this.updateTotalDonatedValue(createdDonation.donor_id!,createdDonation.campaign_id!,createdDonation.value!);
        this.updateDonorTotalDonatedValue(createdDonation.donor_id!,createdDonation.value!);
        campaign!.current_donation_value! += createdDonation.value!;
        this.campaignManager.updateField(campaign!,["current_donation_value"]);

        return new OperationResult(createdDonation, errors);
    }

    private async updateTotalDonatedValue(donor_id:number,campaign_id:number,donatedValue:number)
    {
        let totalDonatedValue = await this.totalDonatedValueRepo.getFirstByCondition(
            [new Constraint("donor_id",Operator.EQUALS,donor_id),new Constraint("campaign_id",Operator.EQUALS,campaign_id)],
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
            totalDonatedValue.campaign_id = campaign_id;
            totalDonatedValue.donor_id = donor_id;
            totalDonatedValue.total_value = donatedValue;
            this.totalDonatedValueRepo.create(totalDonatedValue);
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
