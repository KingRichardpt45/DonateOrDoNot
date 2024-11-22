import {EntityManager} from "@/core/managers/EntityManager";
import {OperationResult} from "@/core/managers/OperationResult";
import {FormError} from "@/core/managers/FormError";
import {Donor} from "@/models/Donor";
import {SimpleError} from "@/core/managers/SimpleError";
import { RepositoryAsync } from "../repository/RepositoryAsync";
import { StoreItem } from "@/models/StoreItem";
import { PrimaryKeyPart } from "../repository/PrimaryKeyPart";
import { DonorBadge } from "@/models/DonorBadge";
import { Badge } from "@/models/Badge";
import { BadgeManager } from "./BadgeManager";
import { DonorStoreItem } from "@/models/DonorStoreItem";
import { BadgeTypes } from "@/models/types/BadgeTypes";


export class DonorManager extends EntityManager<Donor> 
{
    private readonly storeItemRepo : RepositoryAsync<StoreItem>;
    private readonly donorBadgeRepo : RepositoryAsync<DonorBadge>;
    private readonly donorStoreItemRepo : RepositoryAsync<DonorStoreItem>;
    private readonly badgeRepo : RepositoryAsync<Badge>;

    constructor() {
        super(Donor);
        this.storeItemRepo = new RepositoryAsync(StoreItem);
        this.donorBadgeRepo = new RepositoryAsync(DonorBadge);
        this.donorStoreItemRepo = new RepositoryAsync(DonorStoreItem);
        this.badgeRepo = new RepositoryAsync(Badge);
    }

    async signUp(donor: Donor): Promise<OperationResult<Donor | null, FormError>> 
    {
        const createdDonor = await this.repository.create(donor);
        return new OperationResult(createdDonor,[]);
    }

    async getTopTotalValueDonors( page:number, pageSize:number): Promise< OperationResult< Donor[] | null, SimpleError> >
    {
        return this.getTopDonors(page,pageSize,"total_donated_value");
    }

    async getTopTotalDonationsValueDonors( page:number, pageSize:number): Promise< OperationResult< Donor[] | null, SimpleError> >
    {
        return this.getTopDonors(page,pageSize,"total_donations");
    }

    async getTopFrequencyOfDonationsDonors( page:number, pageSize:number): Promise< OperationResult< Donor[] | null, SimpleError> >
    {
        return this.getTopDonors(page,pageSize,"best_frequency_of_donation");
    }

    private async getTopDonors(page:number, pageSize:number, topAttribute:string ): Promise< OperationResult< Donor[] | null, SimpleError> >
    {
        const donors = await this.repository.getByCondition(
            [],
            (d)=>[],
            [{ column: `${Donor.getTableName()}.${topAttribute}`, order: "desc" }],
            pageSize,
            page*pageSize,
        )

        if( donors.length == 0)
            return new OperationResult(null,[new SimpleError("No results where fount.")]);
        else
            return new OperationResult(donors,[]);
    }

    async byStoreItem(donorId:number,storeItemId:number): Promise< OperationResult<boolean,FormError> >
    {
        const errors = []

        const donor = await this.getById(donorId);
        if( donor == null )
            errors.push(new FormError("donor_id",["Id not found."]) )

        const item = await this.storeItemRepo.getByPrimaryKey([new PrimaryKeyPart("id",storeItemId)]);
        if( item == null )
            errors.push(new FormError("storeItem_id",["Id not found."]) )

        if(errors.length > 0)
            return new OperationResult(false,errors);

        if (donor!.donacoins! >= item!.cost!)
        {
            donor!.donacoins! -= item!.cost!;
            this.repository.updateFields(donor!,"donacoins");

            const donorStoreItemToCreate = new DonorStoreItem();
            donorStoreItemToCreate.store_item_id = storeItemId;
            donorStoreItemToCreate.donor_id = donorId;
            await this.donorStoreItemRepo.create(donorStoreItemToCreate);

            return new OperationResult(true,[]);
        }
        else
            return new OperationResult(false,[new FormError("donacoins",["Insufficient donacoins."] )]);

    }

    async unlockBadge(donor_id:number,badge_id:number): Promise< OperationResult<boolean,FormError> >
    {
        const errors = []
        const donor = await this.getById(donor_id);
        const badge = await this.badgeRepo.getByPrimaryKey([new PrimaryKeyPart("id",badge_id)]);

        if( badge == null )
        {
            errors.push(new FormError("badge_id",["Id not found."]) )
        }
        else if(donor != null)
        {
            if ( (badge.type == BadgeTypes.FrequencyOfDonations && donor.best_frequency_of_donation! < badge.value!) ||
                 (badge.type == BadgeTypes.TotalDonations && donor.total_donated_value! < badge.value!) ||
                 (badge.type == BadgeTypes.TotalValueDonated && donor.total_donated_value! < badge.value!) ) 
            {
                errors.push( new FormError("donor_id", ["Doesn't meet the requirements to unlock the badge."]) );
            }
            else if (badge.type == BadgeTypes.CampaignFamily || badge.type == BadgeTypes.CampaignHelper || badge.type == BadgeTypes.CampaignPartner)
                errors.push(new FormError("badge_id",["You are not authorized to unlock campaign badges."]) );
        }
        else
            errors.push(new FormError("donor_id",["Id not found."]) )

        if(errors.length > 0)
            return new OperationResult(false,errors);

        const donorBadgeToCreate = new DonorBadge();
        donorBadgeToCreate.badge_id = badge_id;
        donorBadgeToCreate.donor_id = donor_id;
        await this.donorBadgeRepo.create(donorBadgeToCreate);

        return new OperationResult(true,[]);
    }
}