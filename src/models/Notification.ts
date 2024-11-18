import {Entity} from "@/core/repository/Entity";
import {User} from "@/models/User";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {Campaign} from "@/models/Campaign";
import {NotificationTypes} from "@/models/types/NotificationTypes";

export class Notification extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    message: string | null = null;
    type: NotificationTypes = NotificationTypes.NewDonation;

    user_id: number | null = null;
    campaign_id: number | null = null;

    readonly user = new NavigationKey<User>(this, "user", "user_id", Notification.getTableName(), Notification.getEntityName(), User.getTableName(), User.getEntityName(), "id", null);
    readonly campaign = new NavigationKey<Campaign>(this, "campaign", "campaign_id", Notification.getTableName(), Notification.getEntityName(), Campaign.getTableName(), Campaign.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "message", "type", "user_id", "campaign_id"];
    }

    getNavigationKeys(): string[] {
        return ["user", "campaign"];
    }

    getTableName(): string {
        return Notification.getTableName();
    }

    getEntityName(): string {
        return Notification.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof Notification && this.id === object.id;
    }

    static getTableName(): string {
        return "Notifications";
    }

    static getEntityName(): string {
        return "Notification";
    }
}