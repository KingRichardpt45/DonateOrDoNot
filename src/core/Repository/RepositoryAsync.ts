import { IEntity } from "@/core/Repository/IEntity";
import { IRepositoryAsync } from "@/core/Repository/IRepositoryAsync";
import { dbConnection } from "@/db/KnexConnection"
import { EntityConverter } from "./EntityConverter";
import { getModelFactory } from "@/core/Utils/Factory/ModelsFactory";
import { StringCaseConverter } from "../Utils/StringCaseConverter";
import knex, { Knex } from "knex";
import { Constrain } from "@/core/Repository/Constrain";
import { IFactory } from "../Utils/Factory/IFactory";
import { PrimaryKeyPart } from "./PrimaryKeyPart";
import { ALL } from "dns";
import { NavigationKey } from "./NavigationKey";

export class RepositoryAsyncV1<Entity extends IEntity> implements IRepositoryAsync<Entity> 
{
    readonly tableName: string;
    readonly entityName : string ;
    readonly entityConverter : EntityConverter;
    readonly typeObject : Entity ;
    readonly dbConnection : Knex<any,any[]> ;
    
    constructor( entityName: string )
    {
        let modelFactory : IFactory = getModelFactory();
        this.typeObject = modelFactory.create(entityName) as Entity;
        this.tableName = this.typeObject.getTableName();
        this.entityName = this.typeObject.getEntityName()
        this.entityConverter = new EntityConverter(modelFactory);
        this.dbConnection = dbConnection;
    }
    getAll(includes: string[], orderBy: any[], limit: number): Promise<Entity[]> {
        throw new Error("Method not implemented.");
    }

    // getAll(includes: string[], orderBy: any[], limit: number, offset: number): Promise<Entity[]> {
    //     // let query = this.dbConnection( this.tableName );
    //     throw new Error("Method not implemented.");
    //     // query = this.applyPaginationAndSorting(query,orderBy,limit,offset);
    //     //return;
    // }
    getByPrimaryKey(primaryKeyParts: { name: string; value: any; }[], includes: string[]): Promise<Entity | null> {
        throw new Error("Method not implemented.");
    }
    getByCondition(constrains: { key: string; op: string; value: any; }[], includes: string[], orderBy: any[], limit: number): Promise<Entity[]> {
        throw new Error("Method not implemented.");
    }
    getFirstByCondition(constrains: { key: string; op: string; value: any; }[], includes: string[], orderBy: any[], limit: number): Promise<Entity | null> {
        throw new Error("Method not implemented.");
    }




    async create(entity: Entity): Promise<Entity> 
    {
        return await this.createAux(entity) as Entity;
    }

    private async createAux(entity: IEntity): Promise<IEntity> 
    {
        throw new Error("Method not implemented.");
        // if( entity.isCreated() )
        //     throw new Error("Invalid Operation");

        // let createdNavigationObjects = await this.createNestedNavigationEntities(entity) ;

        // let convertedEntity = this.entityConverter.toKnexObject(entity);
        // let result : any = (await dbConnection( entity.getClassName() + "s" ).insert(convertedEntity,entity.getKeys()))[0] 

        // let createdEntity = this.modelFactory.create( entity.getClassName() , result) as IEntity;
        
        // this.updateNavigationObjects(createdEntity,createdNavigationObjects);

        // return createdEntity;
    }

    private async createNestedNavigationEntities(entity : IEntity) : Promise<{ navigationKey : string, entity : any }[]>
    {
        let createdNavigationObjects : { navigationKey : string, entity : any }[] = [] 
        let navigationKey : NavigationKey<IEntity>;

        for( const navigationKeyName of entity.getNavigationKeys())
        {
            navigationKey = entity[navigationKeyName] as NavigationKey<IEntity>;

            if(navigationKey == null)
            {
                throw new Error("Invalid entity type definition in getNavigationKeys where entity[navigationKeyName] as null instead of NavigationKey<Entity extends IEntity>.")
            }
                
            if( navigationKey.isArray() && navigationKey.value?.length > 0 && ((navigationKey.value as IEntity[] )[0]).isCreated() )
            {

            }  
            else if( !navigationKey.isArray() && navigationKey.value != null )
            {
                let createdNavigationEntity = await this.createAux( navigationKey.value as IEntity ); 
                createdNavigationObjects.push({ navigationKey : navigationKey.key, entity : createdNavigationEntity }); 
               // this.updateForeignKey(entity,createdNavigationEntity);   
            }
        }

        return createdNavigationObjects;
    }




    async update(entity: Entity ) : Promise<boolean>
    {
        return this.updateExcluding(entity);
    }

    async updateExcluding(entity: Entity , ...excludedFields:string[] ) : Promise<boolean>
    {
        let keys = entity.getPrimaryKeyParts().concat(excludedFields);
        let convertedEntity = this.entityConverter.toKnexObjectExcludingFields(entity, keys) ;
        let query = dbConnection( this.tableName )
        query = this.addPrimaryKeyConstrains(query,entity);

        let result : any[] = await query.update(convertedEntity,keys) as any[];
        return result.length == 1 ;
    }

    async updateFields(entity: Entity , ...Fields:string[] ) : Promise<boolean>
    {
        let convertedEntity = this.entityConverter.toKnexObjectOnlyFields(entity, Fields);
        let query = dbConnection( this.tableName )
        query = this.addPrimaryKeyConstrains(query,entity);

        let result : any[] = await query.update(convertedEntity,Fields) as any[];
        return result.length == 1 ;
    }
    



    async delete( entity: Entity ): Promise<boolean> 
    {
        let query = this.dbConnection( this.tableName );
        query = this.addPrimaryKeyConstrains(query,entity);

        let result : number = await query.delete() as number;

        return result == 1;
    }

    async deleteRange( entities: Entity[] ): Promise<Array<Boolean>> 
    {
        let results : Boolean[] = [];
        for (const entity of entities) 
        {
            results.push( await this.delete(entity) );
        }
        
        return results
    }

    async deleteRangeByPrimaryKeys(... primaryKeys: PrimaryKeyPart[][] ): Promise<number>
    {
        let query = dbConnection( this.tableName );
        let keyPartIndex = 0;

        for (let objectIndex = 0; objectIndex < primaryKeys.length; objectIndex++) 
        {
            keyPartIndex=0;
            for (const primaryKeyPart of this.typeObject.getPrimaryKeyParts() ) 
            {
                query = query.where(primaryKeyPart,"=",primaryKeys[objectIndex][keyPartIndex].value)
                keyPartIndex++;
            }
        }
                
        let result : number = await query.delete() as number;

        return result;
    }
    
    async deleteByCondition( constrains : Constrain[]): Promise<number> 
    {
        let query = this.addConstrains( this.dbConnection( this.tableName ), constrains );
        let result = await query.delete() 
        return result;
    }




    private addConstrains( query:Knex.QueryBuilder, constrains:Constrain[] ) : Knex.QueryBuilder
    {
        for (const constrain of constrains) 
        {
            query = this.addConstrain(query,constrain);
        }

        return query
    }

    private addConstrain(  query:Knex.QueryBuilder, constrain:Constrain ): Knex.QueryBuilder
    {
        switch(constrain.op)
        {
            case "like":
                query = query.whereLike(constrain.key,constrain.value);
                break;
            case "!=":
                query = query.whereNot(constrain.key,constrain.value);
                break;
            default:
                query = query.where(constrain.key,constrain.op,constrain.value);
                break;
        }

        return query;
    } 

    private addPrimaryKeyConstrains(  query:Knex.QueryBuilder, entity:Entity ): Knex.QueryBuilder
    {
        let count = 0;
        for( const primaryKeyPart of  entity.getPrimaryKeyParts())
        {
            if(count == 0)
                query = query.where(primaryKeyPart,"=",entity[primaryKeyPart])
            else
                query = query.andWhere(primaryKeyPart,"=",entity[primaryKeyPart])

            count++;
        }

        return query;
    } 

    private applyPaginationAndSorting( query:Knex.QueryBuilder , orderBy: any[], limit: number , offset: number) : Knex.QueryBuilder
    {
        if(orderBy.length == 0)
            query = query.orderBy(orderBy);

        if(limit != 0)
            query = query.limit(limit);

        if(offset != 0)
            query = query.offset(offset);

        return query;
    }
}