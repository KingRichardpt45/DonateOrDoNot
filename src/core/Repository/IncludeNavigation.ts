import { IEntity } from "./IEntity";
import { NavigationKey } from "./NavigationKey";

/**
 * Represents a navigation configuration for including related entities 
 * in a query, providing information on the navigation key and dependency index.
 */
export class IncludeNavigation
{
    /** 
     * The navigation key used to define a link between entities.
     */
    readonly navigationKey : NavigationKey<IEntity>;

     /** 
     * The index indicating dependency priority or order in navigation.
     * This index can be used to resolve dependencies among navigation keys.
     */
    readonly dependingNavigationKeyIndex : number;

    /**
     * Creates an instance of IncludeNavigation.
     * 
     * @param {NavigationKey<IEntity>} navigationKey - The navigation key that defines the relationship to include.
     * @param {number} index - The index representing the dependency order for this navigation key.
     */
    constructor( navigationKey: NavigationKey<IEntity>, index:number)
    {
        this.navigationKey = navigationKey;
        this.dependingNavigationKeyIndex = index;
    }
}