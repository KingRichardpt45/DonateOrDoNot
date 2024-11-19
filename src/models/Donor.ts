import {NavigationKey} from "@/core/repository/NavigationKey";
import {User} from "@/models/User";
import {Donation} from "@/models/Donation";
import {DonorBadge} from "@/models/DonorBadge";
import {DonorStoreItem} from "@/models/DonorStoreItem";
import {Notification} from "./Notification";
import { Entity } from "@/core/repository/Entity";

export class Donor extends Entity 
{
    [key: string]: unknown;

    id: number | null = null;
    donacoins: number | null = null;
    total_donations: number | null = null;
    total_donated_value: number | null = null;
    frequency_of_donation: number | null = null;
    frequency_of_donation_datetime: Date | null = null;
    best_frequency_of_donation_datetime: Date | null = null;
    best_frequency_of_donation: number | null = null;

    readonly user = new NavigationKey<User>(this, "user", "id", Donor.getTableName(), Donor.getEntityName(), User.getTableName(), User.getEntityName(), "id", null);
    readonly donations = new NavigationKey<Donation>(this, "donations", "id", Donor.getTableName(), Donor.getEntityName(), Donation.getTableName(), Donation.getEntityName(), "user_id", null);
    readonly badges = new NavigationKey<DonorBadge>(this, "badges", "id", Donor.getTableName(), Donor.getEntityName(), DonorBadge.getTableName(), DonorBadge.getEntityName(), "user_id", null);
    readonly store_items = new NavigationKey<DonorStoreItem>(this, "store_items", "id", Donor.getTableName(), Donor.getEntityName(), DonorStoreItem.getTableName(), DonorStoreItem.getEntityName(), "user_id", null);
    readonly notifications = new NavigationKey<Notification>(this, "notifications", "id", Donor.getTableName(), Donor.getEntityName(), Notification.getTableName(), Notification.getEntityName(), "user_id", []);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id",
            "donacoins",
            "total_donations",
            "total_donated_value",
            "frequency_of_donation",
            "frequency_of_donation_datetime",
            "best_frequency_of_donation_datetime",
            "best_frequency_of_donation"
        ];
    }

    getNavigationKeys(): string[] {
        return ["user",
            "donations",
            "badges",
            "store_items",
            "notifications"];
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