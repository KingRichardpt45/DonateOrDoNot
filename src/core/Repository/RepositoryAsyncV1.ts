import {IEntity} from "@/core/repository/IEntity";
import {dbConnection} from "@/db/KnexConnection"
import {EntityConverter} from "@/core/repository/EntityConverter";
import {getModelFactory} from "@/core/utils/factory/ModelsFactory";
import {Factory} from "@/core/utils/factory/Factory";
import {StringCaseConverter} from "@/core/utils/StringCaseConverter";
import {Knex} from "knex";

export class RepositoryAsyncV1<Entity extends IEntity> //implements IRepositoryAsync<Entity> 
{

    readonly tableName: string;
    readonly entityClassName: string;
    readonly entityConverter: EntityConverter;
    readonly modelFactory: Factory;
    readonly typeObject: Entity;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.entityClassName = this.tableName.slice(0, this.tableName.length - 1);
        this.modelFactory = getModelFactory();
        this.entityConverter = new EntityConverter(this.modelFactory);
        this.typeObject = this.modelFactory.create(this.entityClassName)
    }

    async getAll(includes: string[], orderBy: any[] = [], limit: number = 0): Promise<Entity[]> {
        let query = dbConnection(this.tableName);
        query = this.include(query, includes);
        const selectColumns = this.formatSelect(includes);
        selectColumns.push(`${this.tableName}.*`);

        if (orderBy.length > 0)
            query = query.orderBy(orderBy);

        if (limit > 0)
            query = query.limit(limit)

        const result = await query.select(selectColumns);

        return this.constructEntities("", result, includes);
    }

    async getByPrimaryKey(primaryKeyParts: { name: string, value: any }[], includes: string[]): Promise<Entity | null> {
        let query = dbConnection(this.tableName)
        query = this.include(query, includes);
        const selectColumns = this.formatSelect(includes);
        selectColumns.push(`${this.tableName}.*`);

        for (const primaryKeyPart of primaryKeyParts) {
            query = query.where(primaryKeyPart["name"], "=", primaryKeyPart["value"]);
        }

        const result = await query.select(selectColumns);

        const entities = this.constructEntities("", result, includes)

        return entities.length > 0 ? entities[0] : null;
    }

    async getByCondition(constrains: {
        key: string,
        op: string,
        value: any
    }[], includes: string[] = [], orderBy: any[] = [], limit: number = 0): Promise<Entity[]> {
        let query = dbConnection(this.tableName);
        const selectColumns = this.formatSelect(includes);
        selectColumns.push(`${this.tableName}.*`);
        query = this.include(query, includes);
        query = this.addConstrains(query, constrains);

        if (orderBy.length == 0)
            query = query.orderBy(orderBy);

        if (limit != 0)
            query = query.limit(limit)

        const result = await query.select(selectColumns);

        return this.constructEntities("", result, includes);
    }

    async getFirstByCondition(constrains: {
        key: string,
        op: string,
        value: any
    }[], includes: string[], orderBy: any[] = [], limit: number = 0): Promise<Entity | null> {
        const entries = await this.getByCondition(constrains, includes, orderBy, limit);

        return entries.length > 0 ? entries[0] : null;
    }

    async create(entity: Entity): Promise<Entity> {
        return await this.createAux(entity) as Entity;
    }

    async update(entity: Entity, ...excludedFields: string[]): Promise<boolean> {
        // excludedFields = excludedFields.concat( entity.getPrimaryKeyParts() ).concat( entity.getNavigationKeys() );
        const convertedEntity = this.entityConverter.toKnexObject(entity);
        const keys = entity.getKeys();
        let query = dbConnection(this.tableName)

        let count = 0;
        for (const primaryKeyPart of entity.getPrimaryKeyParts()) {
            if (count == 0)
                query = query.where(primaryKeyPart, "=", entity[primaryKeyPart])
            else
                query = query.andWhere(primaryKeyPart, "=", entity[primaryKeyPart])

            count++;
        }

        const r: any[] = await query.update(convertedEntity, keys) as any[];
        console.log(r)
        return r.length == 1;
    }

    async delete(entity: Entity): Promise<boolean> {
        let query = dbConnection(this.tableName);

        for (const primaryKeyPart of this.typeObject.getPrimaryKeyParts()) {
            console.log(primaryKeyPart, entity[primaryKeyPart]);

            query = query.where(primaryKeyPart, "=", entity[primaryKeyPart])
        }

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

    async deleteRangeByPrimaryKeys(...primaryKeys: any[]): Promise<number> {
        let query = dbConnection(this.tableName);

        let count = 0
        for (const primaryKey of this.typeObject.getPrimaryKeyParts()) {
            query = query.whereIn(primaryKey, primaryKeys[count])
            count++;
        }

        return await query.delete() as number;
    }

    async deleteByCondition(constrains: { key: string, op: string, value: any }[]): Promise<number> {
        const query = this.addConstrains(dbConnection(this.tableName), constrains);
        return await query.delete() as number;
    }

    private formatSelect(includes: string[]) {
        let selectedColumns: string[] = []

        for (const include of includes) {
            const spitedInclude = include.split(".");

            let entity: IEntity | null = null;
            if (spitedInclude.length > 1)
                entity = this.modelFactory.create(spitedInclude[spitedInclude.length - 1]) as IEntity
            else
                entity = this.modelFactory.create(spitedInclude[0]) as IEntity

            const tableName = entity.getClassName() + "s";
            const array = entity.getKeys().map(name => `${tableName}.${name} as ${include}.${name}`);

            selectedColumns = selectedColumns.concat(...array)

        }

        return selectedColumns
    }

    private constructEntities(alias: string, result: any, includes: string[]): Entity[] {
        const entities: Entity[] = [];

        for (const object of result) {
            entities.push(this.constructEntity(this.entityClassName, "", object, includes) as Entity)
        }

        return entities;
    }

    private constructEntity(className: string, alias: string, object: any, includes: string[], includeLevel: number = 1): IEntity {
        const entity: IEntity = this.modelFactory.create(className, object, alias); // "a.b a a.b.c" => a
        const entityNavigationKeys = entity.getNavigationKeys();

        for (const include of includes) {
            const splittedInclude = include.split(".");
            if (splittedInclude.length !== includeLevel)
                continue;

            if (!entityNavigationKeys.includes(splittedInclude[includeLevel - 1]))
                throw new Error(`Invalid include <${splittedInclude[includeLevel - 1]}> for ${className} !`)

            entity[splittedInclude[includeLevel - 1]] = this.constructEntity(splittedInclude[includeLevel - 1], include, object, includes, includeLevel + 1)
        }

        return entity;
    }

    private async createAux(entity: IEntity): Promise<IEntity> {
        if (entity.isCreated())
            throw new Error("Invalid Operation ");

        const createdNavigationObjects = await this.createNestedNavigationEntities(entity);

        const convertedEntity = this.entityConverter.toKnexObject(entity);
        const result: any = (await dbConnection(entity.getClassName() + "s").insert(convertedEntity, entity.getKeys()))[0]

        const createdEntity = this.modelFactory.create(entity.getClassName(), result) as IEntity;

        this.updateNavigationObjects(createdEntity, createdNavigationObjects);

        return createdEntity;
    }

    private async createNestedNavigationEntities(entity: IEntity): Promise<{ navigationKey: string, entity: any }[]> {
        const createdNavigationObjects: { navigationKey: string, entity: any }[] = []

        for (const navigationKey of entity.getNavigationKeys()) {
            if (entity[navigationKey] !== null && !entity[navigationKey].isCreated()) {
                const createdNavigationEntity = await this.createAux(entity[navigationKey] as IEntity);
                createdNavigationObjects.push({navigationKey: navigationKey, entity: createdNavigationEntity});
                this.updateForeignKey(entity, createdNavigationEntity);
            }
        }

        return createdNavigationObjects;
    }

    private updateForeignKey(entity: IEntity, referencedEntity: IEntity) {
        for (const primaryKeyPart of referencedEntity.getPrimaryKeyParts()) {
            const referencedName = StringCaseConverter.convertCamelToSnake(referencedEntity.getClassName()) + "_" + StringCaseConverter.convertCamelToSnake(primaryKeyPart);
            entity[referencedName] = referencedEntity[primaryKeyPart];
        }
    }

    private updateNavigationObjects(entity: IEntity, createdNavigationObjects: {
        navigationKey: string,
        entity: any
    }[]) {
        for (const createdLinkedObject of createdNavigationObjects) {
            entity[createdLinkedObject["navigationKey"]] = createdLinkedObject["entity"]
        }
        return entity as Entity;
    }

    private include(query: Knex.QueryBuilder, includes: string[]): Knex.QueryBuilder {
        let leftTable = "";
        let rightTable = "";
        for (const include of includes) {
            const splittedInclude = include.split(".");
            if (splittedInclude.length >= 2) {
                leftTable = splittedInclude[splittedInclude.length - 2] + "s";
                rightTable = splittedInclude[splittedInclude.length - 1] + "s";
            } else {
                leftTable = this.tableName;
                rightTable = include + "s";
            }

            query = query.leftJoin({[rightTable]: rightTable}, `${leftTable}.${StringCaseConverter.convertCamelToSnake(include)}_id`, `${rightTable}.id`);
        }

        return query;
    }

    private addConstrains(query: Knex.QueryBuilder, constrains: {
        key: string,
        op: string,
        value: any
    }[]): Knex.QueryBuilder {
        if (constrains.length == 0)
            return query;

        let constrain = constrains[0];
        query = query.where(constrain["key"], constrain["op"], constrain["value"]);

        for (let i = 1; i < constrains.length; i++) {
            constrain = constrains[i];
            query = query.andWhere(constrain["key"], constrain["op"], constrain["value"]);
        }

        return query;
    }

}

