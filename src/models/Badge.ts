import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {File} from "@/models/File";
import {BadgeTypes} from "@/models/types/BadgeTypes";

export class Badge extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    name: string | null = null;
    description: string | null = null;
    value: number | null = null;
    unit: string | null = null;
    type: BadgeTypes = BadgeTypes.TotalValueDonated;

    image_id: number | null = null;

    readonly image = new NavigationKey<File>(this, "image", "image_id", Badge.getTableName(), Badge.getEntityName(), File.getTableName(), File.getEntityName(), "id", null)

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "name", "description", "value", "unit", "type", "image_id"];
    }

    getNavigationKeys(): string[] {
        return ["image"];
    }

    getTableName(): string {
        return Badge.getTableName();
    }

    getEntityName(): string {
        return Badge.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof Badge && this.id === object.id;
    }

    static getTableName(): string {
        return "Badges";
    }

    static getEntityName(): string {
        return "Badge";
    }
}