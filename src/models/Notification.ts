import { IEntity } from "@/core/Repository/IEntity";
import { NavigationKey } from "@/core/Repository/NavigationKey";
import { User } from "./User";

export class Notification implements IEntity 
{
    [key: string]: any;

    id : number | null;
    user_id : number | null;
    campaign_id :number | null;
    message : string | null;
    type : number | null;
    user : NavigationKey<User>;
    campaign : NavigationKey<User>;

    constructor()
    {
        this.id = null;
        this.user_id = null;
        this.campaign_id = null;
        this.message = null;
        this.type = 0;

        this.user = new NavigationKey<User>(this,"user","user_id", "Files","File","Users","id","User", null);
        this.campaign = new NavigationKey<User>(this,"campaign","campaign_id", "", "","","","", null);
    }

    isCreated(): boolean 
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
            "user_id",
            "campaign_id",
            "message",
            "type"
        ];
    }
    getNavigationKeys(): string[] 
    {
        return [
            "user",
            "campaign"
        ];
    }
    getEntityName(): string {
        return "Notification";  
    }
    getTableName(): string {
        return "Notifications";
    }
    equals(object: any): boolean 
    {
        if (!(object instanceof Notification)) return false;

        if(object === this) return true

        return this.id === object.id ;
    }
    equalsToKnex(object: any, alias?: string): boolean 
    {
        return this.id === object[`${alias}id`] ;
    }

}