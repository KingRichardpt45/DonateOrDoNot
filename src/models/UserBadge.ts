import { IEntity } from "@/core/repository/IEntity";
import { NavigationKey } from "@/core/repository/NavigationKey";
import { File } from "@/models/File";
import { Address } from "@/models/Address";
import { User } from "@/models/User";
import { Badge } from "@/models/Badge";

export class UserBadge implements IEntity {
    [key: string]: unknown;

    id: number | null = null;
    readonly user = new NavigationKey<File>("user_id", User.getTableName(), "id", User.getEntityName(), null);
    readonly badge = new NavigationKey<Address>("badge_id", Badge.getTableName(), "id", Badge.getEntityName(), null);

    getEntityName(): string {
        return "UserBadge";
    }

    getTableName(): string {
        return "UserBadges";
    }

    isCreated(): boolean {
        return this.id !== null;
    }

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id"];
    }

    getNavigationKeys(): string[] {
        return ["user", "badge"];
    }

    equals(object: unknown): boolean {
        return object instanceof UserBadge && this.id === object.id;
    }
}