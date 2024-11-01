/**
 * Represents an asynchronous repository for managing entities of type `Entity`.
 * This interface defines standard CRUD operations for interacting with a data source.
 * 
 * @template Entity - The type of the entity being managed, which must extend from IEntity.
 */
export interface IEntity 
{
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
    isCreated() : boolean;

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
    getPrimaryKeyParts() : string[];

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
    getKeys() : string[];

    /**
     * Retrieves the navigation keys of the entity, which represent related entities or navigation properties.
     * Navigation keys are typically used to include related entities in queries. 
     * @note Collection Navigation are not sported.
     *  
     * @returns An array of strings representing the navigation keys of the entity.
     * 
     * @example
     * ```typescript
     * // Get navigation keys for a user entity.
     * const navigationKeys = user.getNavigationKeys(); // e.g., ["address", "orders"]
     * ```
     */
    getNavigationKeys() : string[];

    /**
     * Retrieves the class name of the entity.
     * @returns A string representing the class name of the entity, typically for use in metadata or logging.
     * 
     * @example
     * ```typescript
     * // Get the class name of a user entity.
     * const className = user.getClassName(); // e.g., "User"
     * ```
     */
    getClassName() : string;
}