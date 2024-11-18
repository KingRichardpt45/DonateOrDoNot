import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {Campaign} from "@/models/Campaign";
import {Donor} from "@/models/Donor";

export class TotalDonatedValue extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    total_value: number | null = null;
   
    donor_id: number | null = null;
    campaign_id: number | null = null;

    readonly donor = new NavigationKey<Donor>(this, "donor", "donor_id", TotalDonatedValue.getTableName(), TotalDonatedValue.getEntityName(), Donor.getTableName(), Donor.getEntityName(), "id", null);
    readonly campaign = new NavigationKey<Campaign>(this, "campaign", "campaign_id", TotalDonatedValue.getTableName(), TotalDonatedValue.getEntityName(), Campaign.getTableName(), Campaign.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "total_value", "donor_id", "campaign_id"];
    }

    getNavigationKeys(): string[] {
        return ["donor", "campaign"];
    }

    getTableName(): string {
        return TotalDonatedValue.getTableName();
    }

    getEntityName(): string {
        return TotalDonatedValue.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof TotalDonatedValue && this.id === object.id;
    }

    static getTableName(): string {
        return "TotalDonatedValues";
    }

    static getEntityName(): string {
        return "TotalDonatedValue";
    }
}