import {IEntity} from "@/core/repository/IEntity"
import {IFactory} from "../utils/factory/IFactory";

/**
 * A utility class for converting between `IEntity` objects and plain objects
 * suitable for use with Knex.js.
 *
 * The `EntityConverter` provides methods to convert an `IEntity` to a plain object
 * for insertion or manipulation in a database, and to convert a plain object back
 * into an `IEntity` instance.
 */
export class EntityConverter {

    /** The factory used to create entity instances. */
    private readonly factory: IFactory;

    /**
     * Constructs an `EntityConverter` instance.
     *
     * @param factory - The factory used to create entities from plain objects.
     */
    constructor(factory: IFactory) {
        this.factory = factory;
    }

    /**
     * Converts an `IEntity` to a plain object format..
     *
     * This method takes an `IEntity` and returns a plain object where each key-value pair
     * represents a column-value mapping from the entity.
     *
     * @param entity - The `IEntity` instance to convert.
     * @returns A plain object representation of the entity with string keys and any value type.
     *
     * @example
     * ```typescript
     * const entity = new MyEntity();
     * const knexObject = entityConverter.toKnexObject(entity);
     * console.log(knexObject); // Output: { column1: value1, column2: value2 }
     * ```
     */
    toKnexObject(entity: IEntity): { [key: string]: any } {
        const entries = entity.getKeys();
        let object: { [key: string]: any } = {}
        entries.forEach(
            (key) => {
                object[key] = entity[key];
            }
        );
        return object
    }

    /**
     * Converts an `IEntity` to a plain object format, excluding specified fields.
     *
     * This method takes an `IEntity` and returns a plain object where each key-value pair
     * represents a column-value mapping from the entity, excluding fields specified
     * in the `excluding` array. This is helpful for cases where only certain fields should be
     * sent to or saved in the database.
     *
     * @param entity - The `IEntity` instance to convert.
     * @param excluding - An array of field names to exclude from the conversion.
     * @returns A plain object representation of the entity with specified fields excluded.
     *
     * @example
     * ```typescript
     * const entity = new MyEntity();
     * const knexObject = entityConverter.toKnexObjectExcludingFields(entity, ["password", "secretKey"]);
     * console.log(knexObject); // Output: { column1: value1, column2: value2 } (excluding "password" and "secretKey")
     * ```
     */
    toKnexObjectExcludingFields(entity: IEntity, excluding: string[]): { [key: string]: any } {
        const entries = entity.getKeys();
        let object: { [key: string]: any } = {}
        entries.forEach(
            (key) => {
                if (!excluding.includes(key)) {
                    console.log(key, excluding);
                    object[key] = entity[key];
                }
            }
        );
        return object
    }

    /**
     * Converts an `IEntity` to a plain object format, including only specified fields.
     *
     * This method takes an `IEntity` and returns a plain object where each key-value pair
     * represents a column-value mapping from the entity, including only the fields specified
     * in the `fields` array. If a specified field does not exist on the entity, it throws an error.
     * This is useful for scenarios where only specific fields are allowed to be processed or stored.
     *
     * @param entity - The `IEntity` instance to convert.
     * @param fields - An array of field names to include in the conversion.
     * @returns A plain object representation of the entity with only specified fields included.
     *
     * @throws Error if any field specified in the `fields` array does not exist in the entity.
     *
     * @example
     * ```typescript
     * const entity = new MyEntity();
     * const knexObject = entityConverter.toKnexObjectOnlyFields(entity, ["username", "email"]);
     * console.log(knexObject); // Output: { username: "user123", email: "user@example.com" }
     * ```
     */
    toKnexObjectOnlyFields(entity: IEntity, fields: string[]): { [key: string]: any } {
        // const entries = entity.getKeys();
        // let object: { [key: string]: any } = {};

        // fields.forEach(field => 
        //     {
        //         if(entity[field] === undefined)
        //             throw new Error(`Entity ${entity.getEntityName()} has no field ${field}`);
        //         object[field] = entity[field];
        //     }
        // );

        // return object;

        const entries = entity.getKeys();
        let object: { [key: string]: any } = {};

        fields.forEach(field => {
            // Check if the entity has the specified field
            // const entry = entries.find(([key]) => key === field);
            // if (!entry) {
            //     throw new Error(`Field "${field}" does not exist on the entity ${entity.getEntityName()}`);
            // }
            // Add field to object if it exists
            if (entity[field] === null)
                throw new Error(`Field "${field}" does not exist on the entity ${entity.getEntityName()}`);

            object[field] = entity[field];
        });

        return object;
    }

    /**
     * Converts a plain object into an `IEntity` instance, using the provided entity name.
     *
     * This method takes an object (such as one retrieved from a database) and maps it back
     * into an `IEntity` instance, optionally using an alias for the entity.
     *
     * @param object - The plain object to convert to an `IEntity`.
     * @param entityName - The name of the entity to create.
     * @param alias - An optional alias for the entity (defaults to an empty string).
     * @returns An instance of the Entity or `null` if the entity creation fails.
     *
     * @example
     * ```typescript
     * const knexObject = { column1: value1, column2: value2 };
     * const entity = entityConverter.knexObjectIEntity(knexObject, "MyEntity");
     * console.log(entity); // Output: an instance of `MyEntity` populated with values from knexObject.
     * ```
     */
    knexObjectToIEntity<Entity extends IEntity>(object: any, entityName: string, alias: string = ""): Entity | null {
        const entity: IEntity = this.factory.create(entityName, object) as IEntity;
        const keys = entity.getKeys();

        for (const key of keys) {
            entity[key] = object[`${alias}${key}`]
        }

        return entity as Entity;
    }

}