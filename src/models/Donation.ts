import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {Campaign} from "@/models/Campaign";
import {Donor} from "@/models/Donor";

export class Donation extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    is_name_hidden: boolean | null = false
    value: number | null = null;
    comment: string | null = "";

    donor_id: number | null = null;
    campaign_id: number | null = null;

    readonly donor = new NavigationKey<Donor>(this, "donor", "donor_id", Donation.getTableName(), Donation.getEntityName(), Donor.getTableName(), Donor.getEntityName(), "id", null);
    readonly campaign = new NavigationKey<Campaign>(this, "campaign", "campaign_id", Donation.getTableName(), Donation.getEntityName(), Campaign.getTableName(), Campaign.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "is_name_hidden", "value", "donor_id", "campaign_id", "comment"];
    }

    getNavigationKeys(): string[] {
        return ["donor", "campaign"];
    }

    getTableName(): string {
        return Donation.getTableName();
    }

    getEntityName(): string {
        return Donation.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof Donation && this.id === object.id;
    }

    static getTableName(): string {
        return "Donations";
    }

    static getEntityName(): string {
        return "Donation";
    }
}