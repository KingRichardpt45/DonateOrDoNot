import {StoreItem} from "@/models/StoreItem";
import {EntityManager} from "./EntityManager";
import {SearchableEntity} from "./SerachableEntity";
import {Constraint} from "../repository/Constraint";
import {OperationResult} from "../utils/operation_result/OperationResult";
import {SimpleError} from "../utils/operation_result/SimpleError";
import {IncludeNavigation} from "../repository/IncludeNavigation";

export class StoreItemManager extends EntityManager<StoreItem> implements SearchableEntity<StoreItem>
{

    constructor()
    {
        super(StoreItem);
    }

    async create( name:string, description:string, cost:number,image_id:number ) : Promise<StoreItem>
    {
        const stoItemToCreate = new StoreItem();
        stoItemToCreate.name = name;
        stoItemToCreate.description = description;
        stoItemToCreate.cost = cost;
        stoItemToCreate.image_id = image_id;

        return this.add(stoItemToCreate);
    }

    async searchWithConstraints(constraints: Constraint[], page: number, pageSize: number): Promise<OperationResult<StoreItem[], SimpleError>>
    {
        const inNamesResult = await this.repository.getByCondition(constraints,
            (storeItem)=>[new IncludeNavigation(storeItem.image,0)],[],pageSize,page*pageSize);

        const inDescriptionResult = await this.repository.getByCondition(constraints,
            (storeItem)=>[new IncludeNavigation(storeItem.image,0)],[],pageSize,page*pageSize);

        inDescriptionResult.forEach( (value)=>inNamesResult.push(value) );

        if(inNamesResult.length == 0)
            return new OperationResult( [] , [ new SimpleError("No items where found.") ]);
        else
            return new OperationResult( inNamesResult , []);
    }

}