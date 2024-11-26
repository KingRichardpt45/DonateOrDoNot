import { IEntity } from "@/core/repository/IEntity";

/**
 * A utility class that adapts an entity implementing the `IEntity` interface into a plain object.
 * This allows for flexible transformation of entities into key-value pairs for various purposes,
 * such as serialization or API responses.
 * 
 * @template Entity - A generic type that extends the `IEntity` interface.
 */
export class EntityAdapter<Entity extends IEntity> {

    /**
     * The entity object to be adapted.
     * @private
     */
    private readonly object: Entity;

    /**
     * Creates an instance of `EntityAdapter`.
     * 
     * @param entity - The entity object to be adapted.
     */
    constructor(entity: Entity) {
        this.object = entity;
    }

    /**
     * Generates a plain object representation of the entity.
     * 
     * The method iterates over the keys provided by the `getKeys()` method
     * of the `IEntity` interface and maps them to their corresponding values in the entity.
     * 
     * @returns {Record<string, any>} A plain object where keys are the entity's property names,
     * and values are the respective property values.
     */
    public getAdaptedObject(): { [key: string]: any } {
        const adaptedObject: { [key: string]: any } = {};

        for (const key of this.object.getKeys()) {
            adaptedObject[key] = this.object[key];
        }

        return adaptedObject;
    }
}
