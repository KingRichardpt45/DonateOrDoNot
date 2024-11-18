import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {Campaign} from "@/models/Campaign";
import {User} from "@/models/User";
import {File} from "./File";
import {Notification} from "./Notification";
import {CampaignManagerTypes} from "@/models/types/CampaignManagerTypes";

export class CampaignManager extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    description: string | null = null;
    contact_email: string | null = null;
    verified: boolean | null = null;
    type: CampaignManagerTypes = CampaignManagerTypes.Autonomous;

    identification_file_id: number | null = null;

    readonly identification_file = new NavigationKey<User>(this, "identification_file", "identification_file_id", CampaignManager.getTableName(), CampaignManager.getEntityName(), File.getTableName(), File.getEntityName(), "id", null);
    readonly user = new NavigationKey<User>(this, "user", "id", CampaignManager.getTableName(), CampaignManager.getEntityName(), User.getTableName(), User.getEntityName(), "id", null);
    readonly campaigns = new NavigationKey<Campaign>(this, "campaigns", "id", CampaignManager.getTableName(), CampaignManager.getEntityName(), Campaign.getTableName(), Campaign.getEntityName(), "user_id", null);
    readonly notifications = new NavigationKey<Notification>(this, "notifications", "id", CampaignManager.getTableName(), CampaignManager.getEntityName(), Notification.getTableName(), Notification.getEntityName(), "user_id", []);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "description", "contact_email", "verified", "type"];
    }

    getNavigationKeys(): string[] {
        return ["user", "campaigns", "identification_file", "notifications"];
    }

    getTableName(): string {
        return CampaignManager.getTableName();
    }

    getEntityName(): string {
        return CampaignManager.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof CampaignManager && this.id === object.id;
    }

    static getTableName(): string {
        return "CampaignManagers";
    }

    static getEntityName(): string {
        return "CampaignManager";
    }
}