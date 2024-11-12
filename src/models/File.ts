import { IEntity } from "@/core/repository/IEntity";
import { User } from "@/models/User";
import { NavigationKey } from "@/core/repository/NavigationKey";

export class File implements IEntity {
    [key: string]: unknown;

    id: number | null = null;
    uploaded_by_user_id: number | null = null;
    campaign_id: number | null = null;
    original_name: string | null = null;
    file_suffix: string | null = null;
    file_type: number | null = null;
    file_path: string | null = null;
    timestamp: Date | null = null;
    type: number = 0;

    user: NavigationKey<User> = new NavigationKey<User>("user_id", User.getTableName(), "id", User.getEntityName(), null);
    campaign: NavigationKey<any> = new NavigationKey<any>("campaign_id", "Campaigns", "id", "Campaign", null);

    getEntityName(): string {
        return File.getEntityName();
    }

    getTableName(): string {
        return File.getTableName();
    }

    isCreated(): boolean {
        return this.id !== null;
    }

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "uploaded_by_user_id", "campaign_id", "original_name", "file_suffix", "file_type", "file_path", "timestamp"];
    }

    getNavigationKeys(): string[] {
        return ["user", "campaign"];
    }

    equals(object: unknown): boolean {
        return object instanceof File && this.id === object.id;
    }

    static getTableName(): string {
        return "File";
    }

    static getEntityName(): string {
        return "Files";
    }
}