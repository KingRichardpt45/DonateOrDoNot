/**
 * Represents an asynchronous repository for managing entities of type `Entity`.
 * This interface defines standard CRUD operations for interacting with a data source.
 *
 * @template Entity - The type of the entity being managed, which must extend from IEntity.
 */
export interface IEntity {
    /**
     * Allows access to any string key with a value of any type, providing flexibility in defining entity attributes.
     */
    [key: string]: any;

    /**
     * Determines if the entity has been created (e.g., saved in the database).
     * @returns A boolean indicating if the entity exists in the data source.
     *
     * @example
     * ```typescript
     * // Check if a user entity is created.
     * if (user.isCreated()) {
     *     console.log("User already exists in the database.");
     * }
     * ```
     */
    isCreated(): boolean;

    /**
     * Retrieves the primary key parts of the entity.
     * @returns An array of strings representing the primary key properties of the entity.
     *
     * @example
     * ```typescript
     * // Get the primary key parts of a user entity.
     * const primaryKeys = user.getPrimaryKeyParts(); // e.g., ["id"]
     * ```
     */
    getPrimaryKeyParts(): string[];

    /**
     * Retrieves all the keys of the entity.
     * @returns An array of strings representing all the properties of the entity.
     *
     * @example
     * ```typescript
     * // Get all the keys of a user entity.
     * const keys = user.getKeys(); // e.g., ["id", "name", "email"]
     * ```
     */
    getKeys(): string[];

    /**
     * Retrieves the navigation keys of the entity, which represent related entities or navigation properties.
     *
     * @returns An array of strings representing the navigation keys of the entity.
     *
     * @example
     * ```typescript
     * // Get navigation keys for a user entity.
     * const navigationKeys = user.getNavigationKeys(); // e.g., ["address", "orders"]
     * ```
     */
    getNavigationKeys(): string[];

    /**
     * Retrieves the name of the entity.
     * @returns A string representing the name of the entity (same as the class name).
     *
     * @example
     * ```typescript
     * // Get the name of  the entity  of a user entity.
     * const className = user.getEntityName(); // e.g., "User"
     * ```
     */
    getEntityName(): string;

    /**
     * Retrieves the table name of the entity.
     * @returns A string representing the table name of the entity.
     *
     * @example
     * ```typescript
     * // Get the class name of a user entity.
     * const className = user.getTableName(); // e.g., "Users"
     * ```
     */
    getTableName(): string;

    /**
     * Compares if the object are equals or referencing the same.
     *
     * @param object any, the object to compare.
     * @returns true if the object is the same by equals comparison.
     */
    equals(object: any): boolean;

    /**
     * Compares if the object are equals.
     *
     * @param {any} object - The KNEX Object to compare.
     * @param {string} [alias] - An optional alias for the comparison.
     * @returns {boolean} true if the KNEX Object is the same by PRIMARY KEYS comparison.
     */
    equalsToKnex(object: any, alias?: string): boolean;
}