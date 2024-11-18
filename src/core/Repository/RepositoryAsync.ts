import {IEntity} from "@/core/repository/IEntity";
import {IRepositoryAsync} from "@/core/repository/IRepositoryAsync";
import {EntityConverter} from "./EntityConverter";
import {getModelFactory} from "@/core/utils/factory/ModelsFactory";
import {Knex} from "knex";
import {Constrain} from "@/core/repository/Constrain";
import {IFactory} from "../utils/factory/IFactory";
import {PrimaryKeyPart} from "./PrimaryKeyPart";
import {NavigationKey} from "./NavigationKey";
import {IncludeNavigation} from "./IncludeNavigation";
import {Services} from "@/services/Services";
import {DBConnectionService} from "@/services/DBConnectionService";

export class RepositoryAsync<Entity extends IEntity> implements IRepositoryAsync<Entity> {
    readonly tableName: string;
    readonly entityName: string;
    readonly entityConverter: EntityConverter;
    readonly modelFactory: IFactory;
    readonly typeObject: Entity;
    readonly dbConnection: Knex<any, any[]>;

    /**
     * Constructs a new instance of the repository
     * @param entityConstructor The constructor that defines de repository Entity
     *
     * @example
     * let repo = new RepositoryAsync(User)
     * or
     * let repo = new RepositoryAsync<User>(User)
     */
    constructor( entityConstructor :new (...args: any[]) => Entity , dbConnection?:Knex<any,any> )  
    {
        let modelFactory : IFactory = getModelFactory();
        this.modelFactory = modelFactory;
        this.typeObject = new entityConstructor() as Entity;
        this.tableName = this.typeObject.getTableName();
        this.entityName = this.typeObject.getEntityName()
        this.entityConverter = new EntityConverter(modelFactory);

        if(dbConnection == null)
            this.dbConnection = Services.getInstance().get<DBConnectionService>("DBConnectionService").dbConnection;
        else
        this.dbConnection = dbConnection;
    }

    async getAll(includeFunction: (entity: Entity) => IncludeNavigation[] = () => [], orderBy: unknown[] = [], limit: number = 0, offset: number = 0): Promise<Entity[]> {
        const includes = includeFunction(this.modelFactory.create(this.entityName) as Entity);
        let query = this.dbConnection(this.tableName);
        const selectColumns = this.selectEntityColumn();
        query = this.include(query, includes, selectColumns);
        query = this.applyPaginationAndSorting(query, orderBy, limit, offset);

        const result = await query.select(selectColumns);

        return this.constructEntities(result, includes);
    }

    async getByPrimaryKey(primaryKeyParts: PrimaryKeyPart[], includeFunction: (entity: Entity) => IncludeNavigation[] = () => []): Promise<Entity | null> {
        const includes = includeFunction(this.modelFactory.create(this.entityName) as Entity);
        let query = this.dbConnection(this.tableName);
        const selectColumns = this.selectEntityColumn();
        query = this.include(query, includes, selectColumns);

        for (const primaryKeyPart of primaryKeyParts) {
            query = query.where(`entity.{primaryKeyPart.key}`, "=", primaryKeyPart.value);
        }

        const result = await query.select(selectColumns);

        const entities = this.constructEntities(result, includes);

        return entities.length == 1 ? entities[0] : null;
    }

    async getByCondition(constrains: Constrain[], includeFunction: (entity: Entity) => IncludeNavigation[] = () => [], orderBy: unknown[], limit: number = 0, offset: number = 0): Promise<Entity[]> {
        constrains = this.filterConstrains(constrains);
        const includes = includeFunction(this.modelFactory.create(this.entityName) as Entity);
        let query = this.dbConnection(this.tableName);
        const selectColumns = this.selectEntityColumn();
        query = this.include(query, includes, selectColumns);
        query = this.addConstrains(query, constrains);
        query = this.applyPaginationAndSorting(query, orderBy, limit, offset);

        const result = await query.select(selectColumns);

        return this.constructEntities(result, includes);
    }

    async getFirstByCondition(constrains: Constrain[], includeFunction: (entity: Entity) => IncludeNavigation[] = () => [], orderBy: unknown[], limit: number, offset: number): Promise<Entity | null> {
        const entries = await this.getByCondition(constrains, includeFunction, orderBy, limit, offset);

        return entries.length > 0 ? entries[0] : null;
    }

    private selectEntityColumn(): string[] {
        //return this.typeObject.getKeys().map( name => `${this.tableName}.${name} as entity.${name}`);
        return [`${this.tableName}.*`];
    }

    private filterConstrains(constrains: Constrain[]): Constrain[] {
        const filteredConstrains = [];
        for (const constrain of constrains) {
            if (this.typeObject[constrain.key] !== undefined) {
                filteredConstrains.push(new Constrain(`${this.tableName}.${constrain.key}`, constrain.op, constrain.value));
            } else
                filteredConstrains.push(constrain)
        }

        return filteredConstrains;
    }

    private include(query: Knex.QueryBuilder, includes: IncludeNavigation[], selects: string[]): Knex.QueryBuilder {
        const included: string[] = [this.entityName];
        let includeNavigation: NavigationKey<IEntity>;

        for (let i = 0; i < includes.length; i++) {
            includeNavigation = includes[i].navigationKey;

            if (included.some(entity => entity === includeNavigation.referencingEntity || entity === includeNavigation.referencedEntity)) {
                query = this.includeAux(query, selects, i, includeNavigation);
                included.push(includeNavigation.referencedEntity);
            } else {
                throw new Error(`Invalid include in ${includeNavigation.referencingEntity} for ${includeNavigation.key} of type ${includeNavigation.referencedEntity}.
                        ${includeNavigation.referencingEntity} is not included. Check the order of includes `);
            }
        }

        if (included.length - 1 != includes.length)
            throw new Error("Not all includes where include" + included.toString());

        return query;
    }

    private includeAux(query: Knex.QueryBuilder, selects: string[], index: number, navigationKey: NavigationKey<IEntity>): Knex.QueryBuilder {

        query = query.leftJoin(
            {[navigationKey.referencedTable]: navigationKey.referencedTable},
            `${navigationKey.referencingTable}.${navigationKey.key}`,
            `${navigationKey.referencedTable}.${navigationKey.referencedColumn}`
        );

        const object = this.modelFactory.create(navigationKey.referencedEntity) as IEntity;
        const array = object.getKeys().map(name => `${navigationKey.referencedTable}.${name} as ${index}.${name}`);

        selects.push(...array);

        return query;
    }

    private constructEntities(results: unknown[], includes: IncludeNavigation[]): Entity[] {
        if (results.length == 0)
            return [];

        const createdEntitiesLists: IEntity[][] = this.buildMatrix(results[0], includes);

        let entityList: IEntity[];
        let resultObject: unknown;
        for (let indexResults = 0; indexResults < results.length; indexResults++) {
            resultObject = results[indexResults];

            entityList = createdEntitiesLists[0];
            if (entityList.length == 0 || !entityList[entityList.length - 1].equalsToKnex(resultObject)) {
                //entityList.push( this.entityConverter.knexObjectToIEntity( resultObject , this.entityName , "entity." ) as Entity );
                entityList.push(this.entityConverter.knexObjectToIEntity(resultObject, this.entityName) as Entity);
            }

            for (let indexCreatedEntitiesLists = 1, includeIndex = 0; indexCreatedEntitiesLists < createdEntitiesLists.length; includeIndex = indexCreatedEntitiesLists++) {
                entityList = createdEntitiesLists[indexCreatedEntitiesLists];
                if (entityList.length == 0 || !entityList[entityList.length - 1].equalsToKnex(resultObject, `${indexCreatedEntitiesLists}.`)) {
                    entityList.push(this.entityConverter.knexObjectToIEntity(resultObject, includes[includeIndex].navigationKey.referencedEntity, `${includeIndex}.`) as IEntity);
                    this.mergeCreatedEntities(createdEntitiesLists, includes, includeIndex, indexCreatedEntitiesLists);
                    entityList.splice(0, entityList.length);
                }
            }
        }

        return createdEntitiesLists[0] as Entity[];
    }

    private buildMatrix(object: unknown, includes: IncludeNavigation[]): IEntity[][] {
        const createdEntitiesLists: IEntity[][] = [];

        for (let i = 0; i <= includes.length; i++) {
            createdEntitiesLists.push([]);
        }

        return createdEntitiesLists;
    }

    private mergeCreatedEntities(createdEntitiesLists: IEntity[][], includes: IncludeNavigation[], navigationKeyIndex: number, mergeIndex: number) {
        const mergeToIndex = includes[navigationKeyIndex].dependingNavigationKeyIndex;
        const navigationKey = includes[navigationKeyIndex].navigationKey;

        const mergeToList = createdEntitiesLists[mergeToIndex];
        const entityToAddIncludes = mergeToList[mergeToList.length - 1];
        const mergeEntitiesList = createdEntitiesLists[mergeIndex];

        if (!navigationKey.isArray() && mergeEntitiesList.length > 1)
            throw new Error("Cannot merge navigationKey is not an array and has more then one item to be added.");

        if (entityToAddIncludes[navigationKey.key] == null)
            throw new Error(`Invalid NavigationKey object ${entityToAddIncludes.getEntityName()} does not contain ${navigationKey.key} `);

        if (navigationKey.isArray())
            (entityToAddIncludes[navigationKey.name].value as IEntity[]).push(mergeEntitiesList[0]);
        else
            entityToAddIncludes[navigationKey.name].value = mergeEntitiesList[0];

    }


    async create(entity: Entity): Promise<Entity> {
        return await this.createAux(entity) as Entity;
    }

    private async createAux(entity: IEntity): Promise<IEntity> {
        if (entity.isCreated())
            throw new Error("Invalid Operation: Trying to create an already created Entity.");

        await this.createDependedNavigationEntities(entity);

        const convertedEntity = this.entityConverter.toKnexObject(entity);

        const results = await this.dbConnection(entity.getTableName())
            .insert(convertedEntity, entity.getKeys());

        if (!results || results.length != 1)
            throw new Error("Cannot create entity!");

        const createdEntity = this.entityConverter.knexObjectToIEntity(results[0], entity.getEntityName()) as IEntity;

        this.updatePrimaryKeys(createdEntity, entity);
        await this.createRelatedNavigationEntities(createdEntity, entity);

        return entity;
    }

    private async createDependedNavigationEntities(entity: IEntity) {
        let navigationKey: NavigationKey<IEntity>;

        for (const navigationKeyName of entity.getNavigationKeys()) {
            navigationKey = entity[navigationKeyName] as NavigationKey<IEntity>;

            if (navigationKey == null)
                throw new Error("Invalid entity type definition in getNavigationKeys where entity[navigationKeyName] as null instead of NavigationKey<Entity extends IEntity>.")

            if (navigationKey.value == null || !navigationKey.isDecency)
                continue;

            await this.createNavigationKeyEntities(entity, navigationKey);
        }
    }

    private updatePrimaryKeys(createdEntity: IEntity, entityModel: IEntity) {
        for (const primaryKeyPart of entityModel.getPrimaryKeyParts()) {
            entityModel[primaryKeyPart] = createdEntity[primaryKeyPart];
        }
    }

    private async createRelatedNavigationEntities(createdEntity: IEntity, entityModel: IEntity) {
        let navigationKey: NavigationKey<IEntity>;

        for (const navigationKeyName of createdEntity.getNavigationKeys()) {
            navigationKey = createdEntity[navigationKeyName] as NavigationKey<IEntity>;

            if (navigationKey == null)
                throw new Error("Invalid entity type definition in getNavigationKeys where entity[navigationKeyName] as null instead of NavigationKey<Entity extends IEntity>.")

            if (navigationKey.value == null || navigationKey.isDecency)
                continue;

            createdEntity[navigationKeyName] = entityModel[navigationKeyName];
            navigationKey = createdEntity[navigationKeyName];

            await this.createNavigationKeyEntities(createdEntity, navigationKey, false);
        }
    }

    private async createNavigationKeyEntities(entity: IEntity, navigationKey: NavigationKey<IEntity>, isDependent = true) {
        if (navigationKey.isArray()) {
            for (const relatedEntity of navigationKey.value as IEntity[]) {
                await this.createNavigationKeyEntity(entity, relatedEntity, navigationKey, isDependent);
            }
        } else {
            await this.createNavigationKeyEntity(entity, navigationKey.value as IEntity, navigationKey, isDependent);
        }
    }

    private async createNavigationKeyEntity(entity: IEntity, relatedEntity: IEntity, navigationKey: NavigationKey<IEntity>, isDependent: boolean) {
        if (isDependent) {
            const createdNavigationEntity = await this.createAux(relatedEntity);
            entity[navigationKey.key] = createdNavigationEntity[navigationKey.referencedColumn];
        } else {
            relatedEntity[navigationKey.referencedColumn] = entity[navigationKey.key];
            await this.createAux(relatedEntity);
        }
    }


    async update(entity: Entity): Promise<boolean> {
        return this.updateExcluding(entity);
    }

    async updateExcluding(entity: Entity, ...excludedFields: string[]): Promise<boolean> {
        const keysToExclude = [...entity.getPrimaryKeyParts(), ...excludedFields];
        const convertedEntity = this.entityConverter.toKnexObjectExcludingFields(entity, keysToExclude);
        let query = this.dbConnection(this.tableName)
        query = this.addPrimaryKeyConstrains(query, entity);

        const result: unknown[] = await query.update(convertedEntity, keysToExclude);
        return result.length == 1;
    }

    async updateFields(entity: Entity, ...Fields: string[]): Promise<boolean> {
        const convertedEntity = this.entityConverter.toKnexObjectOnlyFields(entity, Fields);
        let query = this.dbConnection(this.tableName)
        query = this.addPrimaryKeyConstrains(query, entity);

        const result: unknown[] = await query.update(convertedEntity, Fields);
        return result.length == 1;
    }


    async delete(entity: Entity): Promise<boolean> {
        let query = this.dbConnection(this.tableName);
        query = this.addPrimaryKeyConstrains(query, entity);

        const result: number = await query.delete() as number;

        return result == 1;
    }

    async deleteRange(entities: Entity[]): Promise<Array<boolean>> {
        const results: boolean[] = [];
        for (const entity of entities) {
            results.push(await this.delete(entity));
        }

        return results
    }

    async deleteRangeByPrimaryKeys(...primaryKeys: PrimaryKeyPart[][]): Promise<number> {
        let result = 0;
        for (const entityPrimaryKeys of primaryKeys) {
            let query = this.dbConnection(this.tableName)

            for (const primaryKey of entityPrimaryKeys) {
                query = query.where(primaryKey.key, "=", primaryKey.value);
            }

            result += await query.delete();
        }

        return result;
    }

    async deleteByCondition(constrains: Constrain[]): Promise<number> {
        if (constrains.length === 0) {
            throw new Error("No constraints provided for delete.");
        }

        const query = this.addConstrains(this.dbConnection(this.tableName), constrains);
        const result = await query.delete()
        return result;
    }


    private addConstrains(query: Knex.QueryBuilder, constrains: Constrain[]): Knex.QueryBuilder {
        for (const constrain of constrains) {
            query = this.addConstrainByType(query, constrain);
        }

        return query
    }

    private addConstrainByType(query: Knex.QueryBuilder, constrain: Constrain): Knex.QueryBuilder {
        switch (constrain.op) {
            case "like":
                if (typeof constrain.value !== 'string')
                    throw new Error("Invalid where like. Value is not a string");
                query = query.whereLike(constrain.key, constrain.value);
                break;
            case "!=":
                query = query.whereNot(constrain.key, constrain.value);
                break;
            default:
                query = query.where(constrain.key, constrain.op, constrain.value);
                break;
        }

        return query;
    }

    private addPrimaryKeyConstrains(query: Knex.QueryBuilder, entity: Entity): Knex.QueryBuilder {
        let count = 0;
        for (const primaryKeyPart of entity.getPrimaryKeyParts()) {
            if (count == 0)
                query = query.where(primaryKeyPart, "=", entity[primaryKeyPart])
            else
                query = query.andWhere(primaryKeyPart, "=", entity[primaryKeyPart])

            count++;
        }

        return query;
    }

    private applyPaginationAndSorting(query: Knex.QueryBuilder, orderBy: any[], limit: number, offset: number): Knex.QueryBuilder {
        if (orderBy.length > 0)
            query = query.orderBy(orderBy);

        if (limit != 0)
            query = query.limit(limit);

        if (offset != 0)
            query = query.offset(offset);

        return query;
    }
}