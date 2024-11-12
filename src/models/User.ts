import { IEntity } from "@/core/repository/IEntity";
import { Address } from "./Address";
import { NavigationKey } from "@/core/repository/NavigationKey";
import { File } from "@/models/File";

export class User implements IEntity {
    [key: string]: unknown;

    id: number | null = null;
    address_id: number | null = null;
    first_name: string | null = null;
    middle_names: string | null = null;
    last_name: string | null = null;
    email: string = "";
    email_confirmation_token: string | null = null;
    email_confirmed: boolean = false;
    phone_number: string | null = null;
    password: string = "";
    status: string = "";
    type: number = 0;

    readonly notifications = new NavigationKey<any>("id", "Notifications", "user_id", "Notification", []);
    readonly address = new NavigationKey<Address>("address_id", Address.getTableName(), "id", Address.getEntityName(), null);
    readonly profileImage = new NavigationKey<File>("profile_image_id", File.getTableName(), "id", File.getEntityName(), null);

    getEntityName(): string {
        return User.getEntityName();
    }

    getTableName(): string {
        return User.getTableName();
    }

    getClassName(): string {
        return "User";
    }

    isCreated(): boolean {
        return this.id !== null;
    }

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return [
            "id", "address_id", "profile_image_id", "first_name", "middle_names", "last_name",
            "email", "email_confirmation_token", "email_confirmed", "phone_number", "password",
            "status", "type"
        ];
    }

    getNavigationKeys(): string[] {
        return ["notifications", "address", "profileImage"];
    }

    equals(object: unknown): boolean {
        return object instanceof User && this.id === object.id;
    }

    static getTableName(): string {
        return "User";
    }

    static getEntityName(): string {
        return "Users";
    }
}