import { IEntity } from "@/core/Repository/IEntity";
import { NavigationKey } from "@/core/Repository/NavigationKey";
import { User } from "./User";

export class File implements IEntity
{
    [key: string]: any;

    id : number | null; 
    uploaded_by_user_id : number | null;
    campaign_id : number | null;
    original_name : string | null;
    file_suffix : string | null;
    file_type : number | null;
    file_path : string | null;
    timestamp : Date | null;
    size : number | null;

    user : NavigationKey<User> | null; 
    campaign : NavigationKey<User> | null; 

    constructor() 
    {
        this.id = null;
        this.uploaded_by_user_id = null;
        this.campaign_id = null;
        this.original_name = null;
        this.file_suffix = null;
        this.file_type = null;
        this.file_path = null;
        this.timestamp = null;
        this.size = null;

        this.user = new NavigationKey<User>(this,"user","user_id", "Files","File","Users","id","User", null);
        this.campaign = new NavigationKey<User>(this,"campaign","campaign_id",  "Files","File","Campaigns","id","Campaign", null);

        this.type = 0;
    }

    isCreated(): boolean 
    {
        return this.id !== null;
    }

    getPrimaryKeyParts(): string[] 
    {
        return ["id"];
    }

    getKeys(): string[] {
        return [
            "id",
            "uploaded_by_user_id",
            "campaign_id",
            "original_name",
            "file_suffix",
            "file_type",
            "file_path",
            "timestamp",
            "size"
        ]
    }

    getNavigationKeys(): string[] 
    {
        return ["user","campaign"];
    }

    getEntityName(): string 
    {
        return "File";
    }
    
    getTableName(): string
    {
        return "Files";
    }

    public equals ( object : any)
    {
        if (!(object instanceof File)) return false;

        if(object === this) return true

        return this.id === object.id ;
    }
    
    equalsToKnex(object: any , alias:string = ""): boolean 
    {
        return this.id === object[`${alias}id`] ;
    }
}