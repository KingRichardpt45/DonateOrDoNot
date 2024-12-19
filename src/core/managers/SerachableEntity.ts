import {Constraint} from "../repository/Constraint";
import {IEntity} from "../repository/IEntity";
import {OperationResult} from "../utils/operation_result/OperationResult";
import {SimpleError} from "../utils/operation_result/SimpleError";

/* Represents a generic interface for searchable entities.
* The entity type must extend `IEntity`.
*
* @template Entity - The type of entity that extends `IEntity`.
*/
export interface SearchableEntity<Entity extends IEntity>
{
    /**
     * Searches for entities based on a query string and additional constraints.
     *
     * @param constraints - An array of `Constraint` objects to filter the search results.
     * @param page - The page number for paginated results (starting from 1).
     * @param pageSize - The number of results to include per page.
     * 
     * @returns A promise that resolves with an `OperationResult` containing:
     *          - An array of matching `Entity` objects if the operation is successful.
     *          - A `SimpleError` if the operation fails.
     */
    searchWithConstraints(constraints: Constraint[], page: number, pageSize: number): Promise<OperationResult<Entity[], SimpleError>>
}