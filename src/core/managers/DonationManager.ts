import {EntityManager} from "@/core/managers/EntityManager";
import {Campaign} from "@/models/Campaign";
import {FormError} from "@/core/managers/FormError";
import {OperationResult} from "@/core/managers/OperationResult";
import {Donation} from "@/models/Donation";
import {Donor} from "@/models/Donor";
import { SimpleError } from "./SimpleError";
import { Constrain } from "../repository/Constrain";
import { Operator } from "../repository/Operator";

export class DonationManager extends EntityManager<Donation> 
{

    constructor() {
        super(Donation);
    }

    async createWithValidation(donation: Donation): Promise<OperationResult<Donation | null, FormError>> 
    {
        const errors: FormError[] = [];

        if (!donation.value) {
            errors.push(new FormError("value", ["Value is required"]));
        } else if (donation.value < 0) {
            errors.push(new FormError("value", ["Value must be greater than 0"]));
        }
        if (!donation.donor_id) 
            errors.push(new FormError("donor_id", ["Donor is required"]));

        if (!donation.campaign_id) 
            errors.push(new FormError("campaign_id", ["Campaign is required"]));
        
        if ( donation.comment!.length > 200 ) 
            errors.push(new FormError("comment", ["Maxim number of characters is 200."]));

        if (donation.donor_id) {
            const donorManager = new EntityManager(Donor);
            const donorExists = await donorManager.exists(donation.donor_id);
            if (!donorExists) {
                errors.push(new FormError("donor_id", ["Donor does not exist"]));
            }
        }

        if (donation.campaign_id) {
            const campaignManager = new EntityManager(Campaign);
            const campaignExists = await campaignManager.exists(donation.campaign_id);
            if (!campaignExists) {
                errors.push(new FormError("campaign_id", ["Campaign does not exist"]));
            }
        }

        const createdDonation = errors.length == 0 ? await this.create(donation) : null;
        return new OperationResult(createdDonation, errors);
    }

    async getDonationsOfDonor(donor_id:number, page:number, pageSize:number): Promise< OperationResult< Donation[]| null,SimpleError> >
    {
        const donations = await this.repository.getByCondition(
            [new Constrain("donor_id",Operator.EQUALS,donor_id)],
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
