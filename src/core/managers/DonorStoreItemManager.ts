import {EntityManager} from "./EntityManager";
import {BadgeTypes} from "@/models/types/BadgeTypes";
import {SearchableEntity} from "./SerachableEntity";
import {Constraint} from "../repository/Constraint";
import {OperationResult} from "../utils/operation_result/OperationResult";
import {SimpleError} from "../utils/operation_result/SimpleError";
import {IncludeNavigation} from "../repository/IncludeNavigation";
import { Operator } from "../repository/Operator";
import { DonorStoreItem } from "@/models/DonorStoreItem";
import { StoreItem } from "@/models/StoreItem";

export class DonorStoreItemManager extends EntityManager<DonorStoreItem> implements SearchableEntity<DonorStoreItem> 
{
    
    constructor() {
        super(DonorStoreItem);
    }

    async searchWithConstraints(constraints: Constraint[], page: number, pageSize: number): Promise<OperationResult<DonorStoreItem[], SimpleError>> 
    {
        const result = await this.repository.getByCondition(constraints, 
            (v) => [new IncludeNavigation(v.store_item,0),new IncludeNavigation((new StoreItem()).image,1) ],
             [], pageSize, page * pageSize);

        if (result.length == 0) 
            return new OperationResult([], [new SimpleError("No items where found.")]); 
        else 
            return new OperationResult( result, []) ;
    }

    public async getItemsOfDonor(donor_id:number,page: number, pageSize: number) : Promise<OperationResult<StoreItem[],SimpleError>>
    {   
        const result = await this.repository.getByCondition( [ new Constraint("donor_id",Operator.EQUALS,donor_id) ], 
            (v) => [new IncludeNavigation(v.store_item,0),new IncludeNavigation((new StoreItem()).image,1) ],
                [], pageSize, page * pageSize);

        const foundBadges :StoreItem[]= [];

        result.forEach( (donorBadge) => foundBadges.push( donorBadge.store_item!.value as StoreItem ) );

        return foundBadges.length > 0 ? new OperationResult(foundBadges,[]) : new OperationResult([],[new SimpleError("Not Fount results")]);
    }
}