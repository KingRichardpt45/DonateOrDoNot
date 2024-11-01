import { IEntity } from "@/core/Repository/IEntity"
import { Addresse } from "./Address";


export class User implements IEntity 
{
    [key: string]: any;

    id: number | null; 
    name: string | null; 
    email: string;
    email_confirmation_token?: string | null; 
    email_confirmed: boolean = false; 
    phone_number?: string | null; 
    password: string;
    profile_image?: number | null; 
    type: number = 0; 
    addresse_id: number | null;

    constructor(jsonObject?: { [key: string]: any } , alias: string = "" ) {

        this.id = null;
        this.name = null;
        this.email = "";
        this.email_confirmation_token = null;
        this.email_confirmed = false;
        this.phone_number = null;
        this.password = "";
        this.profile_image = null;
        this.type = 0;
        this.addresse_id = null;

        if(alias !== "" )
            alias = alias + "."

        if (jsonObject) {
            this.id = jsonObject[`${alias}id`] ?? null;
            this.name = jsonObject[`${alias}name`] ?? "";
            this.email = jsonObject[`${alias}email`] ?? "";
            this.email_confirmation_token = jsonObject[`${alias}email_confirmation_token`] ?? null;
            this.email_confirmed = jsonObject[`${alias}email_confirmed`] ?? false;
            this.phone_number = jsonObject[`${alias}phone_number`] ?? null;
            this.password = jsonObject[`${alias}password`] ?? "";
            this.profile_image = jsonObject[`${alias}profile_image`] ?? null;
            this.type = jsonObject[`${alias}type`] ?? 0;
            this.addresse_id = jsonObject[`${alias}addresse_id`] ?? null;
        }
    }

    Addresse: Addresse| null = null;

    getClassName(): string 
    {
        return "User";    
    }

    isCreated()
    {
        return this.id !== null;
    }

    getPrimaryKeyParts(): string[] 
    {
        return ["id"];
    }

    getKeys(): string[] 
    {
        return [
            "id",
            "name",
            "email",
            "email_confirmation_token",
            "email_confirmed",
            "phone_number",
            "password",
            "profile_image",
            "type",
            "addresse_id"
        ]; 
    }

    getNavigationKeys() : string[]
    {
        return ["Addresse"]
    }

    public equals ( object : any)
    {
        if (!(object instanceof User)) return false;

        if(object === this) return true

        return this.id === object.id ;
    }
}