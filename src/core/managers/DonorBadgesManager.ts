import {EntityManager} from "./EntityManager";
import {BadgeTypes} from "@/models/types/BadgeTypes";
import {SearchableEntity} from "./SerachableEntity";
import {Constraint} from "../repository/Constraint";
import {OperationResult} from "../utils/operation_result/OperationResult";
import {SimpleError} from "../utils/operation_result/SimpleError";
import {IncludeNavigation} from "../repository/IncludeNavigation";
import { DonorBadge } from "@/models/DonorBadge";
import { Badge } from "@/models/Badge";
import { Operator } from "../repository/Operator";

export class DonorBadgeManager extends EntityManager<DonorBadge> implements SearchableEntity<DonorBadge> 
{
    
    constructor() {
        super(DonorBadge);
    }

    async searchWithConstraints(constraints: Constraint[], page: number, pageSize: number): Promise<OperationResult<DonorBadge[], SimpleError>> 
    {
        const result = await this.repository.getByCondition(constraints, 
            (v) => [new IncludeNavigation(v.badge,0),new IncludeNavigation((new Badge()).image,1) ],
             [], pageSize, page * pageSize);

        if (result.length == 0) 
            return new OperationResult([], [new SimpleError("No items where found.")]); 
        else 
            return new OperationResult( result, []) ;
    }

    public async getBadgeOfDonor(donor_id:number,page: number, pageSize: number) : Promise<OperationResult< Badge[] , SimpleError> >
    {   
        const result = await this.repository.getByCondition( [ new Constraint("donor_id",Operator.EQUALS,donor_id) ], 
        (v) => [new IncludeNavigation(v.badge,0),new IncludeNavigation((new Badge()).image,1) ],
            [], pageSize, page * pageSize);

        const foundBadges :Badge[]= [];

        result.forEach( (donorBadge) => foundBadges.push( donorBadge.badge!.value as Badge ) );

        return foundBadges.length > 0 ? new OperationResult(foundBadges,[]) : new OperationResult([],[new SimpleError("Not Fount results")]);
    }
}