import { StoreItem } from "@/models/StoreItem";
import { EntityManager } from "./EntityManager";
import { SearchableEntity } from "./SerachableEntity";
import { Constrain } from "../repository/Constrain";
import { OperationResult } from "./OperationResult";
import { SimpleError } from "./SimpleError";
import { Operator } from "../repository/Operator";
import { IncludeNavigation } from "../repository/IncludeNavigation";

export class StoreItemManager extends EntityManager<StoreItem> implements SearchableEntity<StoreItem>
{

    constructor()
    {
        super(StoreItem);
    }

    async search(query: string, page: number, pageSize: number): Promise<OperationResult<StoreItem[], SimpleError>> 
    {   
        return this.searchWithConstrains(query,[],page,pageSize);
    }

    async searchWithConstrains(query: string, constrains: Constrain[], page: number, pageSize: number): Promise<OperationResult<StoreItem[], SimpleError>> 
    {
        const inNamesResult = await this.repository.getByCondition(
            [new Constrain("description",Operator.LIKE,`%${query}%`),...constrains],
            (storeItem)=>[new IncludeNavigation(storeItem.image,0)],[],pageSize,page*pageSize);

        const inDescriptionResult = await this.repository.getByCondition(
            [new Constrain("description",Operator.LIKE,`%${query}%`),...constrains],
            (storeItem)=>[new IncludeNavigation(storeItem.image,0)],[],pageSize,page*pageSize);
        
        inDescriptionResult.forEach( (value)=>inNamesResult.push(value) );
        
        if(inNamesResult.length == 0)
            return new OperationResult( [] , [ new SimpleError("No items where found.") ]);
        else
            return new OperationResult( inNamesResult , []);
    }
    
}