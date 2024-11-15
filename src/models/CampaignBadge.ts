import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {Badge} from "@/models/Badge";
import {Campaign} from "@/models/Campaign";

export class CampaignBadge extends Entity {
    [key: string]: unknown;

    id: number | null = null;

    campaign_id: number | null = null;
    badge_id: number | null = null;

    readonly campaign = new NavigationKey<Campaign>(this, "campaign", "campaign_id", CampaignBadge.getTableName(), CampaignBadge.getEntityName(), Campaign.getTableName(), Campaign.getEntityName(), "id", null);
    readonly badge = new NavigationKey<Badge>(this, "badge", "badge_id", CampaignBadge.getTableName(), CampaignBadge.getEntityName(), Badge.getTableName(), Badge.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "campaign_id", "badge_id"];
    }

    getNavigationKeys(): string[] {
        return ["campaign", "badge"];
    }

    getTableName(): string {
        return CampaignBadge.getTableName();
    }

    getEntityName(): string {
        return CampaignBadge.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof CampaignBadge && this.id === object.id;
    }

    static getTableName(): string {
        return "CampaignBadges";
    }

    static getEntityName(): string {
        return "CampaignBadge";
    }
}