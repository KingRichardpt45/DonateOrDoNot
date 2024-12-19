import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {File} from "@/models/File";

export class StoreItem extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    name: string | null = null;
    description: string | null = null;
    cost: number | null = null;

    image_id: number | null = null;

    readonly image = new NavigationKey<File>(this, "image", "image_id", StoreItem.getTableName(), StoreItem.getEntityName(), File.getTableName(), File.getEntityName(), "id", null)

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "name", "description", "cost", "image_id"];
    }

    getNavigationKeys(): string[] {
        return ["image"];
    }

    getTableName(): string {
        return StoreItem.getTableName();
    }

    getEntityName(): string {
        return StoreItem.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof StoreItem && this.id === object.id;
    }

    static getTableName(): string {
        return "StoreItems";
    }

    static getEntityName(): string {
        return "StoreItem";
    }
}