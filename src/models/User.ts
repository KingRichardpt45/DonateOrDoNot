import {Entity} from "@/core/Repository/Entity";
import {Address} from "./Address";
import {NavigationKey} from "@/core/Repository/NavigationKey";
import {File} from "@/models/File";
import {Notification} from "@/models/Notification";
import {AccountStatus} from "@/models/types/AccountStatus";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";

export class User extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    first_name: string | null = null;
    middle_names: string | null = null;
    last_name: string | null = null;
    email: string | null = null
    email_confirmation_token: string | null = null;
    email_confirmed: boolean = false;
    phone_number: string | null = null;
    password: string | null = null;
    status: AccountStatus = AccountStatus.Pending;
    type: UserRoleTypes = UserRoleTypes.Donor;

    address_id: number | null = null;
    profile_image_id: number | null = null;

    readonly notifications = new NavigationKey<Notification>(this, "notifications", "id", User.getTableName(), User.getEntityName(), Notification.getTableName(), Notification.getEntityName(), "user_id", []);
    readonly address = new NavigationKey<Address>(this, "address", "address_id", User.getTableName(), User.getEntityName(), Address.getTableName(), Address.getEntityName(), "id", null);
    readonly profileImage = new NavigationKey<File>(this, "profileImage", "profile_image_id", User.getTableName(), User.getEntityName(), File.getTableName(), File.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id",
            "first_name",
            "middle_names",
            "last_name",
            "email",
            "email_confirmation_token",
            "email_confirmed",
            "phone_number",
            "password",
            "status",
            "type",
            "address_id",
            "profile_image_id"];
    }

    getNavigationKeys(): string[] {
        return ["notifications", "address", "profileImage"];
    }

    getTableName(): string {
        return User.getTableName();
    }

    getEntityName(): string {
        return User.getEntityName();
    }

    static getTableName(): string {
        return "Users";
    }

    static getEntityName(): string {
        return "User";
    }

    equals(object: unknown): boolean {
        return object instanceof User && this.id === object.id;
    }
}