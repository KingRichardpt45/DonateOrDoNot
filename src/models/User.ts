import {Entity} from "@/core/repository/Entity";
import {Address} from "./Address";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {File} from "@/models/File";
import {UserType} from "@/models/types/UserType";
import {Notification} from "@/models/Notification";
import {UserStatus} from "@/models/types/UserStatus";
import {UserBadge} from "@/models/UserBadge";

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
    status: UserStatus = UserStatus.Unknown;
    type: UserType = UserType.Donor;

    address_id: number | null = null;
    profile_image_id: number | null = null;

    readonly notifications = new NavigationKey<Notification>(this, "notifications", "id", User.getTableName(), User.getEntityName(), Notification.getTableName(), Notification.getEntityName(), "user_id", []);
    readonly badges = new NavigationKey<UserBadge>(this, "badges", "id", User.getTableName(), User.getEntityName(), UserBadge.getTableName(), UserBadge.getEntityName(), "user_id", []);
    readonly address = new NavigationKey<Address>(this, "address", "address_id", User.getTableName(), User.getEntityName(), Address.getTableName(), Address.getEntityName(), "id", null);
    readonly profileImage = new NavigationKey<File>(this, "profileImage", "profile_image_id", User.getTableName(), User.getEntityName(), File.getTableName(), File.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "first_name", "middle_names", "last_name", "email",
            "email_confirmation_token", "email_confirmed", "phone_number",
            "password", "status", "type", "address_id", "profile_image_id"];
    }

    getNavigationKeys(): string[] {
        return ["notifications", "badges", "address", "profileImage"];
    }

    getTableName(): string {
        return User.getTableName();
    }

    getEntityName(): string {
        return User.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof User && this.id === object.id;
    }

    static getTableName(): string {
        return "Users";
    }

    static getEntityName(): string {
        return "User";
    }

    equalsToKnex(object: any , alias:string = ""): boolean 
    {
        return this.id === object[`${alias}id`] ;
    }
}