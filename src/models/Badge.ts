import {IEntity} from "@/core/repository/IEntity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {File} from "@/models/File";
import {BadgeType} from "@/models/types/BadgeType";

export class Badge implements IEntity {
    [key: string]: unknown;

    id: number | null = null;
    name: string | null = null;
    description: string | null = null;
    value: number | null = null;
    unit: string | null = null;
    type: BadgeType = BadgeType.Unknown;
    readonly image = new NavigationKey<File>("image_id", File.getTableName(), "id", File.getEntityName(), null);

    getEntityName(): string {
        return Badge.getEntityName();
    }

    getTableName(): string {
        return Badge.getTableName();
    }

    getClassName(): string {
        return "Badge";
    }

    isCreated(): boolean {
        return this.id !== null;
    }

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "name", "description", "value", "unit"];
    }

    getNavigationKeys(): string[] {
        return ["profileImage"];
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