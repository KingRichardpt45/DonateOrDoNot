import { Constrain } from "../repository/Constrain";
import { IEntity } from "../repository/IEntity";
import { IncludeNavigation } from "../repository/IncludeNavigation";
import { IRepositoryAsync } from "../repository/IRepositoryAsync";
import { RepositoryAsync } from "../repository/RepositoryAsync";

/**
 * EntityManager is a generic class that manages the operations of entities of type `Entity`.
 * It acts as a bridge between the application logic and the underlying repository layer,
 * providing a high-level interface for CRUD and query operations.
 * 
 * @template Entity - Represents the type of entity this manager handles, which must implement `IEntity`.
 */
export class EntityManager<Entity extends IEntity>
{
    protected readonly repository : IRepositoryAsync<Entity>;

     /**
     * Constructs an EntityManager instance for the given entity type.
     * 
     * @param entityConstructor - A constructor function for creating instances of the Entity type.
     */
    constructor( entityConstructor: new (...args: unknown[]) => Entity )
    {
        this.repository = new RepositoryAsync(entityConstructor);
    }

    /**
     * Retrieves a list of entities that match the specified constraints and conditions.
     * 
     * @param constrains - An array of constraints used to filter the entities.
     * @param includeFunction - A function defining the navigation properties to include in the result.
     * @param orderBy - An array specifying the order in which to sort the results.
     * @param limit - The maximum number of entities to retrieve.
     * @param offset - The number of entities to skip before starting to collect results.
     * @returns A promise that resolves to an array of entities matching the specified conditions.
     */
    async getByCondition( constrains: Constrain[] , includeFunction: ( entity : Entity ) => IncludeNavigation[] , orderBy:any[], limit:number, offset:number ): Promise<Entity[]>
    {
        return await this.repository.getByCondition(constrains,includeFunction,orderBy,limit,offset);
    } 

    /**
     * Retrieves the first entity that matches the specified constraints and conditions.
     * 
     * @param constrains - An array of constraints used to filter the entities.
     * @param includeFunction - A function defining the navigation properties to include in the result.
     * @param orderBy - An array specifying the order in which to sort the results.
     * @param limit - The maximum number of entities to consider.
     * @param offset - The number of entities to skip before starting to collect results.
     * @returns A promise that resolves to the first matching entity or `null` if no match is found.
     */
    async getFirstByCondition( constrains: Constrain[] , includeFunction: ( entity : Entity ) => IncludeNavigation[], orderBy:any[], limit:number, offset:number ): Promise<Entity | null>
    {
        return await this.repository.getFirstByCondition(constrains,includeFunction,orderBy,limit,offset);
    } 

    /**
     * Creates a new entity in the repository.
     * 
     * @param entity - The entity instance to be created.
     * @returns A promise that resolves to the created entity.
     */
    async create(entity: Entity): Promise<Entity> 
    {
        return await this.repository.create(entity);
    }

    /**
     * Updates an existing entity in the repository.
     * 
     * @param entity - The entity instance with updated data.
     * @returns A promise that resolves to a boolean indicating whether the update was successful.
     */
    async update(entity: Entity ) : Promise<boolean>
    {
        return await this.repository.update(entity);
    }

    /**
     * Deletes an entity from the repository.
     * 
     * @param entity - The entity instance to be deleted.
     * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
     */
    async delete(entity: Entity): Promise<boolean>
    {
        return await this.repository.delete(entity);
    }
}