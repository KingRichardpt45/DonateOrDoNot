import {User} from "@/models/User";
import {EntityManager} from "@/core/managers/EntityManager";
import {OperationResult} from "@/core/managers/OperationResult";
import {FormError} from "@/core/managers/FormError";
import {Donor} from "@/models/Donor";
import {UserManager} from "@/core/managers/UserManager";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {SimpleError} from "@/core/managers/SimpleError";
import { Operator } from "../repository/Operator";
import { Constrain } from "../repository/Constrain";

export class DonorManager extends EntityManager<Donor> {

    constructor() {
        super(Donor);
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
}