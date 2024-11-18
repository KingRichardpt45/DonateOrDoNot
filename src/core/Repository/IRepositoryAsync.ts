import { IEntity } from "@/core/repository/IEntity";
import { Constrain } from "./Constrain";
import { PrimaryKeyPart } from "./PrimaryKeyPart";
import { IncludeNavigation } from "./IncludeNavigation";

/**
 * Represents an asynchronous repository for managing entities.
 * This interface defines standard CRUD operations for interacting with a data source.
 * 
 * @template Entity - The type of the entity being managed, which must implement IEntity.
 */
export interface IRepositoryAsync< Entity extends IEntity > 
{
    /**
     * Retrieves all entities from the repository, with optional includes, ordering, and limiting.
     * @param includes - An array of relation entities to include in the result set.
     * @param orderBy - An array specifying the sorting order, e.g., [{ column: "columnName", order: "asc" }].
     * @param limit - The maximum number of records to retrieve.
     * @returns A promise that resolves to an array of entities.
     * 
     * @example
     * ```typescript
     * // Get up to 2 users ordered by ID in descending order, including their addresses.
     * const users = await userRepo.getAll(["Addresse"], [{ column: "Users.id", order: "desc" }], 2);
     * ```
     */
    getAll( includeFunction: ( entity : Entity ) => IncludeNavigation[] , orderBy:any[], limit:number, offset:number): Promise<Entity[]> 

     /**
     * Retrieves a single entity based on its primary key.
     * @param primaryKeyParts - Array of objects with name-value pairs representing primary key fields.
     * @param includes - An array of relation entities to include in the result.
     * @returns A promise that resolves to the entity if found, otherwise null.
     * 
     * @example
     * ```typescript
     * // Retrieve a user by primary key ID, including their address.
     * const user = await userRepo.getByPrimaryKey([{ name: "Users.id", value: 20 }], ["Addresse"]);
     * ```
     */
    getByPrimaryKey( primaryKeyParts: PrimaryKeyPart[], includeFunction: ( entity : Entity ) => IncludeNavigation[] ): Promise<Entity | null> 

    /**
     * Retrieves entities that match specific conditions.
     * @param constrains - An array of constraints, each with a key, an operator, and a value.
     * @param includes - An array of relation entities to include in the result.
     * @param orderBy - An array specifying the sorting order.
     * @param limit - The maximum number of records to retrieve.
     * @returns A promise that resolves to an array of matching entities.
     * 
     * @example
     * ```typescript
     * // Get users with ID greater than 20, ordered by ID descending, limited to 2 results, including addresses.
     * const users = await userRepo.getByCondition([{ key: "Users.id", op: ">", value: 20 }], ["Addresse"], [{ column: "Users.id", order: "desc" }], 2);
     * ```
     */
    getByCondition( constrains: Constrain[] , includeFunction: ( entity : Entity ) => IncludeNavigation[] , orderBy:any[], limit:number, offset:number ): Promise<Entity[]> 

    /**
     * Retrieves the first entity that matches specific conditions.
     * @param constrains - An array of constraints, each with a key, an operator (see knexOperators), and a value.
     * @param includes - An array of relation entities to include in the result.
     * @param orderBy - An array specifying the sorting order.
     * @param limit - The maximum number of records to retrieve.
     * @returns A promise that resolves to the first matching entity, or null if none match.
     * 
     * @example
     * ```typescript
     * // Get the first user with ID greater than 20, ordered by ID descending, limited to 2 results, including address.
     * const user = await userRepo.getFirstByCondition([{ key: "Users.id", op: ">", value: 20 }], ["Addresse"], [{ column: "Users.id", order: "desc" }], 2);
     * ```
     */
    getFirstByCondition( constrains: Constrain[] , includeFunction: ( entity : Entity ) => IncludeNavigation[], orderBy:any[], limit:number, offset:number ): Promise<Entity | null>




    /**
     * Creates a new entity in the repository.
     * @param entity - The entity to be created.
     * @returns A promise that resolves to the created entity.
     * 
     * @example
     * ```typescript
     * // Create a new user in the repository.
     * const createdUser = await userRepo.create(user);
     * ```
     */
    create(entity: Entity): Promise<Entity> 




    /**
     * Updates an existing entity in the repository. This method updates all fields
     * of the entity and does not allow exclusion of specific fields.
     * 
     * @param entity - The entity to be updated.
     * @returns A promise that resolves to a boolean indicating if the update was successful.
     * 
     * @example
     * ```typescript
     * // Update a user's phone number.
     * user.phone_number = "925678030";
     * const success = await userRepo.update(user);
     * ```
     */
    update(entity: Entity ) : Promise<boolean>

    /**
     * Updates an existing entity in the repository, excluding specified fields from the update.
     * 
     * @param entity - The entity to be updated.
     * @param excludedFields - A list of field names to exclude from the update operation.
     * @returns A promise that resolves to a boolean indicating if the update was successful.
     * 
     * @example
     * ```typescript
     * // Update a user's phone number, excluding "email" and "name" from the update.
     * user.phone_number = "925678030";
     * const success = await userRepo.updateExcluding(user, "email", "name");
     * ```
     */
    updateExcluding(entity: Entity , ...excludedFields:string[] ) : Promise<boolean>


    /**
     * Updates specific fields of an entity in the repository, updating only the fields specified.
     * 
     * @param entity - The entity to be updated.
     * @param fields - A list of field names to include in the update operation.
     * @returns A promise that resolves to a boolean indicating if the update was successful.
     * 
     * @example
     * ```typescript
     * // Update only a user's "phone_number" and "address".
     * user.phone_number = "925678030";
     * user.address = "123 Main St";
     * const success = await userRepo.updateFields(user, "phone_number", "address");
     * ```
     */
    updateFields(entity: Entity , ...Fields:string[] ) : Promise<boolean>




    /**
     * Deletes an entity from the repository.
     * @param entity - The entity to delete.
     * @returns A promise that resolves to a boolean indicating if the deletion was successful.
     * 
     * @example
     * ```typescript
     * // Delete a specific user.
     * const deleted = await userRepo.delete(user);
     * ```
     */
    delete(entity: Entity): Promise<boolean>

    /**
     * Deletes a range of entities from the repository.
     * @param entities - An array of entities to delete.
     * @returns A promise that resolves to an array of booleans, each indicating if a deletion was successful.
     * 
     * @example
     * ```typescript
     * // Delete multiple users at once.
     * const results = await userRepo.deleteRange([user1, user2, user3]);
     * ```
     */
    deleteRange(entities: Entity[]): Promise<Array<Boolean>>

    /**
     * Deletes entities based on primary key values.
     * @param primaryKeys - An array of primary key values.
     * @returns A promise that resolves to the number of entities deleted.
     * 
     * @example
     * ```typescript
     * // Delete users with specific primary key values.
     * const deletedCount = await userRepo.deleteRangeByPrimaryKeys([1, 2, 3, 4, 6, 8]);
     * ```
     */
    deleteRangeByPrimaryKeys(... primaryKeys: any[] ): Promise<number>

    /**
     * Deletes entities that match specific conditions.
     * @param constrains - An array of constraints, each with a key, an operator, and a value.
     * @returns A promise that resolves to the number of entities deleted.
     * 
     * @example
     * ```typescript
     * // Delete users where ID is 13 and name is "tt".
     * const deletedCount = await userRepo.deleteByCondition([{ key: "id", op: "=", value: 13 }, { key: "name", op: "=", value: "tt" }]);
     * ```
     */
    deleteByCondition( constrains : { key: string , op : string , value: any }[]): Promise<number>
}