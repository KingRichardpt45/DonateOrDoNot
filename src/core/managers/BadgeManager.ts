import { Badge } from "@/models/Badge";
import { EntityManager } from "./EntityManager";
import { BadgeTypes } from "@/models/types/BadgeTypes";
import { SearchableEntity } from "./SerachableEntity";
import { Constrain } from "../repository/Constrain";
import { OperationResult } from "./OperationResult";
import { SimpleError } from "./SimpleError";
import { IncludeNavigation } from "../repository/IncludeNavigation";
import { Operator } from "../repository/Operator";

export class BadgeManager extends EntityManager<Badge> implements SearchableEntity<Badge>
{
    constructor()
    {
        super(Badge);
    }
    
    async create(name:string, description:string, type:BadgeTypes, unit:string | null, value:number | null, imageId:number ): Promise<Badge>
    {
        const badge = new Badge();
        badge.name = name;
        badge.description = description;
        badge.type = type;
        badge.unit = unit ? unit : "";
        badge.value = value ? value : 0;
        badge.image_id = imageId;

        return this.add(badge);
    }

    async search(query: string, page: number, pageSize: number): Promise<OperationResult<Badge[], SimpleError>> 
    {   
        return this.searchWithConstrains(query,[],page,pageSize);
    }

    async searchWithConstrains(query: string, constrains: Constrain[], page: number, pageSize: number): Promise<OperationResult<Badge[], SimpleError>> 
    {
        const inNamesResult = await this.repository.getByCondition(
            [new Constrain("name",Operator.LIKE,`%${query}%`),...constrains],
            (badge)=>[new IncludeNavigation(badge.image,0)],[],pageSize,page*pageSize);

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