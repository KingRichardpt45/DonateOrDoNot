import {IEntity} from "@/core/repository/IEntity";

/**
 * Represents a navigation key that links to a referenced entity or collection of entities.
 * This class stores metadata about the foreign relationship, including the name, the table,
 * and the column being referenced, as well as the value of the referenced entity or entities.
 */
export class NavigationKey<Entity extends IEntity> {
    /** The Entity key name of the navigation key that is used in the relation. */
    readonly key: string;

    /** The name of the table that this key references. */
    readonly referencedTable: string;

    /** The name of the column in the referenced table that this key points to. */
    readonly referencedColumn: string;

    /** The name of the Entity that represents the referenced Table. */
    readonly referencedEntity: string;

    /** The value of the referenced entity or entities. Can be a single `IEntity`, an array of `IEntity`, or `null`. */
    value: Entity | Entity[] | null = null;

    /** A boolean indicating whether `value` is an iterable collection (e.g., array) of `IEntity` instances. */
    private readonly valueIsArray: boolean;

    /**
     * Constructs a new `NavigationKey` instance.
     *
     * @param key - The name of the navigation key.
     * @param referencedTable - The name of the table that the navigation key references.
     * @param referencedColumn - The name of the column in the referenced table.
     * @param referencedEntity - The name of the column in the referenced table.
     * @param value - The value of the referenced entity or collection of entities. Defaults to `null`.
     */
    constructor(key: string, referencedTable: string, referencedColumn: string, referencedEntity: string, value: Entity | Entity[] | null = null) {
        this.key = key;
        this.referencedTable = referencedTable;
        this.referencedColumn = referencedColumn;
        this.referencedEntity = referencedEntity;
        this.value = value
        this.valueIsArray = this.value != null && typeof (this.value as any)[Symbol.iterator] === 'function'
    }

    /**
     * Determines if the `value` property is an iterable collection of `IEntity` instances.
     *
     * @returns `true` if `value` is an iterable (e.g., array) of `IEntity` instances, otherwise `false`.
     *
     * @example
     * ```typescript
     * const key = new NavigationKey("exampleKey", "ReferencedTable", "ReferencedColumn", [entity1, entity2]);
     * console.log(key.isArray()); // Output: true
     * ```
     */
    public isArray(): boolean {
        return this.valueIsArray;
    }
}