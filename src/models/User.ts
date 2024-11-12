import { IEntity } from "@/core/Repository/IEntity"
import { Address } from "./Address";
import { NavigationKey } from "@/core/Repository/NavigationKey";
import { File } from "@/models/File"


export class User implements IEntity 
{
    [key: string]: any;

    id : number | null; 
    address_id : number | null;
    first_name : string | null; 
    middle_names : string | null;
    last_name : string | null;
    email : string;
    email_confirmation_token : string | null; 
    email_confirmed : boolean = false; 
    phone_number : string | null; 
    password : string;
    status : string;
    type: number = 0; 

    readonly notifications: NavigationKey<any>;
    readonly address: NavigationKey<Address>;
    readonly profileImage: NavigationKey<File>;

    constructor(jsonObject?: { [key: string]: any } ) 
    {
        this.id = null;
        this.address_id = null;
        this.profile_image_id = null;
        this.first_name = null;
        this.middle_names = null;
        this.last_name = null;
        this.email = "";
        this.email_confirmation_token = null;
        this.email_confirmed = false;
        this.phone_number = null;
        this.password = "";
        this.status = "";
        this.type = 0;

        this.notifications = new NavigationKey<any>("id","Notifications","user_id","Notification", new Array<any>() );
        this.address = new NavigationKey<Address>("address_id","Addresses","id","Address", null );
        this.profileImage = new NavigationKey<File>("profile_image_id","Files","id","File", null );

    }

    getEntityName(): string 
    {
        return "User";    
    }

    getTableName(): string 
    {
        return "Users";    
    }

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
            "address_id",
            "profile_image_id",
            "first_name",
            "middle_names",
            "last_name",
            "email",
            "email_confirmation_token",
            "email_confirmed",
            "phone_number",
            "password",
            "status",
            "type"
        ]; 
    }

    getNavigationKeys() : string[]
    {
        return ["notifications","address","profileImage"]
    }

    public equals ( object : any)
    {
        if (!(object instanceof User)) return false;

        if(object === this) return true

        return this.id === object.id ;
    }
}