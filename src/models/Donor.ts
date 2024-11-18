import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {User} from "@/models/User";
import {Donation} from "@/models/Donation";
import {UserBadge} from "@/models/UserBadge";
import {UserStoreItem} from "@/models/UserStoreItem";

export class Donor extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    donacoins: number | null = null;
    total_donations: number | null = null;
    total_donated_value: number | null = null;
    frequency_of_donation: number | null = null;
    frequency_of_donation_datetime: unknown | null = null;
    best_frequency_of_donation_datetime: unknown | null = null;

    readonly user = new NavigationKey<User>(this, "user", "id", Donor.getTableName(), Donor.getEntityName(), User.getTableName(), User.getEntityName(), "id", null);
    readonly donations = new NavigationKey<Donation>(this, "donations", "id", Donor.getTableName(), Donor.getEntityName(), Donation.getTableName(), Donation.getEntityName(), "user_id", null);
    readonly badges = new NavigationKey<UserBadge>(this, "badges", "id", Donor.getTableName(), Donor.getEntityName(), UserBadge.getTableName(), UserBadge.getEntityName(), "user_id", null);
    readonly store_items = new NavigationKey<UserStoreItem>(this, "store_items", "id", Donor.getTableName(), Donor.getEntityName(), UserStoreItem.getTableName(), UserStoreItem.getEntityName(), "user_id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "donacoins", "total_donations", "total_donated_value", "frequency_of_donation", "frequency_of_donation_datetime", "best_frequency_of_donation_datetime", "user_id", "donations", "badges", "store_items"];
    }

    getNavigationKeys(): string[] {
        return ["user", "campaigns", "badges", "store_items"];
    }

    getTableName(): string {
        return Donor.getTableName();
    }

    getEntityName(): string {
        return Donor.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof Donor && this.id === object.id;
    }

    static getTableName(): string {
        return "Donors";
    }

    static getEntityName(): string {
        return "Donor";
    }
}