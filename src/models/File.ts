import {Entity} from "@/core/repository/Entity";
import {User} from "@/models/User";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {Campaign} from "@/models/Campaign";
import {FileTypes} from "@/models/types/FileTypes";

export class File extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    original_name: string | null = null;
    file_suffix: string | null = null;
    file_type: FileTypes = FileTypes.Image;
    file_path: string | null = null;
    timestamp: Date | null = null;
    size: number | null = null;

    user_id: number | null = null;
    campaign_id: number | null = null;

    readonly user = new NavigationKey<User>(this, "user", "user_id", File.getTableName(), File.getEntityName(), User.getTableName(), User.getEntityName(), "id", null);
    readonly campaign = new NavigationKey<Campaign>(this, "campaign", "campaign_id", File.getTableName(), File.getEntityName(), Campaign.getTableName(), Campaign.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "original_name", "file_suffix", "file_type", "file_path",
            "timestamp", "user_id", "campaign_id", "size"];
    }

    getNavigationKeys(): string[] {
        return ["user", "campaign"];
    }

    getTableName(): string {
        return File.getTableName();
    }

    getEntityName(): string {
        return File.getEntityName();
    }

    static getTableName(): string {
        return "Files";
    }

    static getEntityName(): string {
        return "File";
    }

    equals(object: unknown): boolean {
        return object instanceof File && this.id === object.id;
    }
}