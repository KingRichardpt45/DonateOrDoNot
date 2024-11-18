import { Factory } from "@/core/utils/factory/Factory";
import { User } from "@/models/User"
import { Address } from "@/models/Address";
import { Notification } from "@/models/Notification";

/**
 * A pre-configured instance of the `Factory` class, specifically for managing model types.
 * The `ModelFactory` allows creating instances of registered models by their unique names.
 *
 * @example
 * ```typescript
 * // Create a User instance using ModelFactory
 * const user = ModelFactory.create<User>("User", "John Doe", 30);
 * ```
 */
const ModelFactory : Factory = new Factory(
    { type : User , name : "User" },
    { type : Address , name : "Address" },
    { type : Notification , name : "Notification" }
);

/**
 * Retrieves the singleton instance of `ModelFactory`, which is pre-configured with model types.
 * This function provides a centralized access point to the factory instance for model creation.
 *
 * @returns The `ModelFactory` instance, preloaded with `User` and `Address` model constructors.
 *
 * @example
 * ```typescript
 * // Access ModelFactory and create an Address instance
 * const factory = getModelFactory();
 * const address = factory.create<Address>("Address", "123 Main St", "Springfield", "12345");
 * ```
 */
export function getModelFactory() 
{
    return ModelFactory;
}