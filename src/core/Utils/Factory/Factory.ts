import { IFactory } from "@/core/utils/factory/IFactory"

/**
 * Represents a generic factory for creating instances of registered types.
 * The `Factory` class allows registering multiple types with unique names, enabling dynamic creation of instances.
 */
export class Factory implements IFactory {
    /**
     * Stores constructors of registered types with their associated names.
     */
    private constructs: { constructor: new (...args: any[]) => any, name: string }[] = [];

    /**
     * Initializes a new `Factory` instance and registers multiple types for later instantiation.
     *
     * @param types - An array of objects, each containing a `type` (constructor function) and a `name` (string) for registration.
     *
     * @example
     * ```typescript
     * // Register types User and Address in the factory
     * const factory = new Factory({ type: User, name: "User" }, { type: Address, name: "Address" });
     * ```
     */
    constructor(...types: { type: (new (...args: any[]) => any), name: string }[]) {
        for (const obj of types) {
            this.constructs.push({constructor: obj["type"], name: obj["name"]})
        }
    }

    /**
     * Creates an instance of the registered type identified by the provided name.
     *
     * @typeParam T - The expected type of the instance to be created.
     * @param name - The unique name identifying the registered type.
     * @param args - Additional arguments passed to the constructor when creating the instance.
     *
     * @returns A new instance of the specified type.
     * @throws An error if the specified type name is not registered.
     *
     * @example
     * ```typescript
     * // Create an instance of User with arguments passed to its constructor
     * const user = factory.create<User>("User", "John Doe", 30);
     * ```
     */
    public create<T>(name: string, ...args: any[]): T {
        let constructor = null;

        for (const element of this.constructs) {
            if (element["name"] === name)
                constructor = element["constructor"];
        }

        if (constructor == null) throw new Error("Invalid type in the factory !");
        return new constructor(...args);
    }

    /**
     * Retrieves the constructor function for the specified registered type name.
     *
     * @param name - The unique name identifying the registered type.
     * @returns The constructor function of the specified type.
     * @throws An error if the specified type name is not registered.
     *
     * @example
     * ```typescript
     * // Get the constructor function of User
     * const userConstructor = factory.getConstructor("User");
     * const user = new userConstructor("Jane Doe", 25);
     * ```
     */
    public getConstructor(name: string): new (...args: any[]) => any {
        let constructor = null;

        for (const element of this.constructs) {
            if (element["name"] === name)
                constructor = element["constructor"];
        }

        if (constructor == null) throw new Error("Invalid type in the factory !");
        return constructor;
    }
}