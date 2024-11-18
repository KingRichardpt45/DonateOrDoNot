import {Entity} from "@/core/repository/Entity";
import {User} from "@/models/User";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {Campaign} from "@/models/Campaign";
import {Badge} from "@/models/Badge";
import {FileTypes} from "@/models/types/FileTypes";

export class File extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    original_name: string | null = null;
    file_suffix: string | null = null;
    file_type: number | null = null;
    file_path: string | null = null;
    timestamp: Date | null = null;
    type: FileTypes = FileTypes.Image;

    user_id: number | null = null;
    campaign_id: number | null = null;
    badge_id: number | null = null;

    readonly user = new NavigationKey<User>(this, "user", "user_id", File.getTableName(), File.getEntityName(), User.getTableName(), User.getEntityName(), "id", null);
    readonly campaign = new NavigationKey<Campaign>(this, "campaign", "campaign_id", File.getTableName(), File.getEntityName(), Campaign.getTableName(), Campaign.getEntityName(), "id", null);
    readonly badge = new NavigationKey<Badge>(this, "badge", "badge_id", File.getTableName(), File.getEntityName(), Badge.getTableName(), Badge.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "original_name", "file_suffix", "file_type", "file_path", "timestamp", "user_id", "campaign_id", "badge_id"];
    }

    getNavigationKeys(): string[] {
        return ["user", "campaign", "badge"];
    }

    getTableName(): string {
        return File.getTableName();
    }

    getEntityName(): string {
        return File.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof File && this.id === object.id;
    }

    static getTableName(): string {
        return "Files";
    }

    static getEntityName(): string {
        return "File";
    }
 
    equalsToKnex(object: any , alias:string = ""): boolean 
    {
        return this.id === object[`${alias}id`] ;
    }
}