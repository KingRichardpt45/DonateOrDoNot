import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {User} from "@/models/User";
import {Badge} from "@/models/Badge";
import { Donor } from "./Donor";

export class DonorBadge extends Entity {
    [key: string]: unknown;

    id: number | null = null;

    donor_id: number | null = null;
    badge_id: number | null = null;
    unblock_at: Date | null = null;

    readonly donor = new NavigationKey<User>(this, "donor", "donor_id", DonorBadge.getTableName(), DonorBadge.getEntityName(), Donor.getTableName(), Donor.getEntityName(), "id", null);
    readonly badge = new NavigationKey<Badge>(this, "badge", "badge_id", DonorBadge.getTableName(), DonorBadge.getEntityName(), Badge.getTableName(), Badge.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "donor_id", "badge_id","unblock_at"];
    }

    getNavigationKeys(): string[] {
        return ["user", "badge"];
    }

    getTableName(): string {
        return DonorBadge.getTableName();
    }

    getEntityName(): string {
        return DonorBadge.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof DonorBadge && this.id === object.id;
    }

    static getTableName(): string {
        return "DonorBadges";
    }

    static getEntityName(): string {
        return "DonorBadge";
    }
}