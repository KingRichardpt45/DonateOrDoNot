import { IEntity } from "@/core/repository/IEntity";
import { Address } from "./Address";
import { NavigationKey } from "@/core/Repository/NavigationKey";
import { File } from "@/models/File"
import { Notification } from "./Notification";

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

    readonly notifications = new NavigationKey<Notification>(this,"notifications","id","Users","User","Notifications","user_id","Notification", new Array<any>() );
    readonly address = new NavigationKey<Address>(this,"address","address_id","Users","User","Addresses","id","Address", null );
    readonly profileImage = new NavigationKey<File>(this,"profileImage","profile_image_id", "Users","User" ,"Files","id","File", null );

    getEntityName(): string {
        return User.getEntityName();
    }

    getTableName(): string {
        return User.getTableName();
    }

    getClassName(): string {
        return "User";
    }

    isCreated()
    {
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

    equalsToKnex(object: any , alias:string = ""): boolean 
    {
        return this.id === object[`${alias}id`] ;
    }
}