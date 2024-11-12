import { IEntity } from "@/core/Repository/IEntity";

export class Address implements IEntity
{
    [key: string]: any;

    id : number | null; 
    postal_code : string | null; 
    city : string | null;
    address : string | null;
    door : string | null;

    constructor(jsonObject?: { [key: string]: any }, alias : string = "") 
    {
        this.id = null;
        this.postal_code = null;
        this.city = null;
        this.address = null;  
        this.door = null; 
    }

    getEntityName(): string 
    {
        return "Address";
    }

    getTableName(): string 
    {
        return "Addresses";
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
            "postal_code",
            "city",
            "address",
            "door"
        ]; 
    }

    getNavigationKeys() : string[]
    {
        return []
    }

    public equals ( object : any)
    {
        if (!(object instanceof Address)) return false;

        if(object === this) return true

        return this.id === object.id ;
    }
}