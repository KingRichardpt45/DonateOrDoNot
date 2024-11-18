import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {CampaignManagerTypes} from "@/models/types/CampaignManagerTypes";
import {Campaign} from "@/models/Campaign";
import {User} from "@/models/User";

export class CampaignManager extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    description: string | null = null;
    contact_email: string | null = null;
    verified: boolean | null = null;
    type: CampaignManagerTypes = CampaignManagerTypes.Autonomous;

    readonly user = new NavigationKey<User>(this, "user", "id", CampaignManager.getTableName(), CampaignManager.getEntityName(), User.getTableName(), User.getEntityName(), "id", null);
    readonly campaigns = new NavigationKey<Campaign>(this, "campaigns", "id", CampaignManager.getTableName(), CampaignManager.getEntityName(), Campaign.getTableName(), Campaign.getEntityName(), "user_id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "description", "contact_email", "verified", "type"];
    }

    getNavigationKeys(): string[] {
        return ["user", "campaigns"];
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