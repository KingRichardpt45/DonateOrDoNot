import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {StoreItem} from "@/models/StoreItem";
import {Donor} from "./Donor";

export class DonorStoreItem extends Entity {
    [key: string]: unknown;

    id: number | null = null;

    donor_id: number | null = null;
    store_item_id: number | null = null;

    readonly donor = new NavigationKey<Donor>(this, "donor", "donor_id", DonorStoreItem.getTableName(), DonorStoreItem.getEntityName(), Donor.getTableName(), Donor.getEntityName(), "id", null);
    readonly store_item = new NavigationKey<StoreItem>(this, "store_item", "store_item_id", DonorStoreItem.getTableName(), DonorStoreItem.getEntityName(), StoreItem.getTableName(), StoreItem.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "user_id", "badge_id"];
    }

    getNavigationKeys(): string[] {
        return ["donor", "store_item"];
    }

    getTableName(): string {
        return DonorStoreItem.getTableName();
    }

    getEntityName(): string {
        return DonorStoreItem.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof DonorStoreItem && this.id === object.id;
    }

    static getTableName(): string {
        return "DonorStoreItems";
    }

    static getEntityName(): string {
        return "DonorStoreItem";
    }
}