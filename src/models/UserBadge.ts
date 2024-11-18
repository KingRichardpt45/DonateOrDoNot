import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {User} from "@/models/User";
import {Badge} from "@/models/Badge";
import {Campaign} from "@/models/Campaign";

export class UserBadge extends Entity {
    [key: string]: unknown;

    id: number | null = null;

    user_id: number | null = null;
    badge_id: number | null = null;
    unblock_at: Date | null = null;

    readonly user = new NavigationKey<User>(this, "user", "user_id", UserBadge.getTableName(), UserBadge.getEntityName(), Campaign.getTableName(), Campaign.getEntityName(), "id", null);
    readonly badge = new NavigationKey<Badge>(this, "badge", "badge_id", UserBadge.getTableName(), UserBadge.getEntityName(), Badge.getTableName(), Badge.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "user_id", "badge_id","unblock_at"];
    }

    getNavigationKeys(): string[] {
        return ["user", "badge"];
    }

    getTableName(): string {
        return UserBadge.getTableName();
    }

    getEntityName(): string {
        return UserBadge.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof UserBadge && this.id === object.id;
    }

    static getTableName(): string {
        return "UserBadges";
    }

    static getEntityName(): string {
        return "UserBadge";
    }
}