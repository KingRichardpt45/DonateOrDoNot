/**
 * Defines the structure of a factory for creating instances of dynamically registered types.
 * The `IFactory` interface provides methods for creating instances and retrieving constructors
 * by a unique name identifier.
 */
export interface IFactory 
{
    /**
     * Creates an instance of a registered type by its unique name.
     * 
     * @typeParam T - The expected type of the instance to be created.
     * @param name - The unique name identifying the registered type.
     * @param args - Additional arguments passed to the constructor when creating the instance.
     * 
     * @returns A new instance of the specified type if found, or `null` if the type is not registered.
     * 
     * @example
     * ```typescript
     * // Assuming "User" is registered in the factory:
     * const user = factory.create<User>("User", "John Doe", 30);
     * if (user) {
     *     console.log("User created:", user);
     * } else {
     *     console.error("User type not registered in the factory.");
     * }
     * ```
     */
    create<T>( name: string, ...args: any[]): T | null

    /**
     * Retrieves the constructor function for a registered type by its unique name.
     * 
     * @param name - The unique name identifying the registered type.
     * @returns The constructor function for the specified type, if registered.
     * 
     * @throws An error if the type is not registered.
     * 
     * @example
     * ```typescript
     * // Retrieve the constructor of the registered "User" type
     * const userConstructor = factory.getConstructor("User");
     * const user = new userConstructor("Jane Doe", 25);
     * ```
     */
    getConstructor( name: string ) : new (...args: any[]) => any
}