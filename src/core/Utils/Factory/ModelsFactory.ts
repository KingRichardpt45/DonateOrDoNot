import {Factory} from "@/core/utils/factory/Factory";
import {User} from "@/models/User"
import {Address} from "@/models/Address";
import {Notification} from "@/models/Notification";
import { Donor } from "@/models/Donor";
import { CampaignManager } from "@/models/CampaignManager";
import { BankAccount } from "@/models/BankAccount";
import { Badge } from "@/models/Badge";
import { Campaign } from "@/models/Campaign";
import { Donation } from "@/models/Donation";
import { DonorStoreItem } from "@/models/DonorStoreItem";
import { DonorBadge } from "@/models/DonorBadge";
import { StoreItem } from "@/models/StoreItem";
import { TotalDonatedValue } from "@/models/TotalDonatedValue";
import { CampaignBadge } from "@/models/CampaignBadge";
import { File } from "@/models/File";

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
const ModelFactory: Factory = new Factory(
    {type: Address, name: "Address"},
    {type: Badge , name: "Badge"},
    {type: BankAccount , name: "BankAccount"},
    {type: Campaign , name: "Campaign"},
    {type: CampaignBadge, name: "CampaignBadge"},
    {type: CampaignManager, name: "CampaignManager"},
    {type: Donation, name: "Donation"},
    {type: Donor, name: "Donor"},
    {type: DonorBadge, name: "DonorBadge"},
    {type: DonorStoreItem, name: "DonorStoreItem"},
    {type: File, name: "File"},
    {type: Notification, name: "Notification"},
    {type: StoreItem, name: "StoreItem"},
    {type: TotalDonatedValue, name: "TotalDonatedValue"},
    {type: User, name: "User"},

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
export function getModelFactory() {
    return ModelFactory;
}