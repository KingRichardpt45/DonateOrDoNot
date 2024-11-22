import { Constrain } from "../repository/Constrain";
import { IEntity } from "../repository/IEntity";
import { OperationResult } from "./OperationResult";
import { SimpleError } from "./SimpleError";

/* Represents a generic interface for searchable entities.
* The entity type must extend `IEntity`.
*
* @template Entity - The type of entity that extends `IEntity`.
*/
export interface SearchableEntity<Entity extends IEntity>
{
    /**
     * Searches for entities based on a query string.
     *
     * @param query - The search query string used to find matching entities.
     * @param page - The page number for paginated results (starting from 1).
     * @param pageSize - The number of results to include per page.
     * 
     * @returns A promise that resolves with an `OperationResult` containing:
     *          - An array of matching `Entity` objects if the operation is successful.
     *          - A `SimpleError` if the operation fails.
     */
    search(query:string, page:number, pageSize:number): Promise<OperationResult<Entity[],SimpleError>> 

    /**
     * Searches for entities based on a query string and additional constraints.
     *
     * @param query - The search query string used to find matching entities.
     * @param constrains - An array of `Constrain` objects to filter the search results.
     * @param page - The page number for paginated results (starting from 1).
     * @param pageSize - The number of results to include per page.
     * 
     * @returns A promise that resolves with an `OperationResult` containing:
     *          - An array of matching `Entity` objects if the operation is successful.
     *          - A `SimpleError` if the operation fails.
     */
    searchWithConstrains(query:string, constrains:Constrain[], page:number, pageSize:number): Promise<OperationResult<Entity[],SimpleError>> 
}