import {EntityManager} from "@/core/managers/EntityManager";
import {OperationResult} from "@/core/managers/OperationResult";
import {FormError} from "@/core/managers/FormError";
import {Donor} from "@/models/Donor";
import {SimpleError} from "@/core/managers/SimpleError";
import { RepositoryAsync } from "../repository/RepositoryAsync";
import { StoreItem } from "@/models/StoreItem";
import { PrimaryKeyPart } from "../repository/PrimaryKeyPart";


export class DonorManager extends EntityManager<Donor> 
{
    private readonly storeItemManagerRepo : RepositoryAsync<StoreItem>;

    constructor() {
        super(Donor);
        this.storeItemManagerRepo = new RepositoryAsync(StoreItem);
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

    async byStoreItem(donor_id:number,storeItem_id:number): Promise< OperationResult<boolean,FormError> >
    {
        const errors = []

        const donor = await this.getById(donor_id);
        if( donor == null )
            errors.push(new FormError("donor_id",["Id not found."]) )

        const item = await this.storeItemManagerRepo.getByPrimaryKey([new PrimaryKeyPart("id",storeItem_id)]);
        if( item == null )
            errors.push(new FormError("storeItem_id",["Id not found."]) )

        if(errors.length > 0)
            return new OperationResult(false,errors);

        if (donor!.donacoins! >= item!.cost!)
        {
            donor!.donacoins! -= item!.cost!;
            this.repository.updateFields(donor!,"donacoins");
            return new OperationResult(false,[new FormError("donacoins",["Insufficient donacoins."] )])
        }
        else
            return new OperationResult(false,[new FormError("donacoins",["Insufficient donacoins."] )]);
    }
}