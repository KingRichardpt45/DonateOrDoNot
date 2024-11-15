import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {User} from "@/models/User";
import {StoreItem} from "@/models/StoreItem";

export class UserStoreItem extends Entity {
    [key: string]: unknown;

    id: number | null = null;

    user_id: number | null = null;
    store_item_id: number | null = null;

    readonly user = new NavigationKey<User>(this, "user", "user_id", UserStoreItem.getTableName(), UserStoreItem.getEntityName(), User.getTableName(), User.getEntityName(), "id", null);
    readonly store_item = new NavigationKey<StoreItem>(this, "store_item", "store_item_id", UserStoreItem.getTableName(), UserStoreItem.getEntityName(), StoreItem.getTableName(), StoreItem.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "user_id", "badge_id"];
    }

    getNavigationKeys(): string[] {
        return ["user", "store_item"];
    }

    getTableName(): string {
        return UserStoreItem.getTableName();
    }

    getEntityName(): string {
        return UserStoreItem.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof UserStoreItem && this.id === object.id;
    }

    static getTableName(): string {
        return "UserStoreItems";
    }

    static getEntityName(): string {
        return "UserStoreItem";
    }
}