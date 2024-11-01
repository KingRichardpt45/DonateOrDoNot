import { IEntity } from "@/core/Repository/IEntity";

export class Addresse implements IEntity
{
    [key: string]: any;

    id: number | null; 
    postal_code: string; 
    city: string;
    address: string;

    constructor(jsonObject?: { [key: string]: any }, alias : string = "") {

        this.id = null;
        this.postal_code = "";
        this.city = "";
        this.address = "";
        
        if(alias !== "" )
            alias = alias + "."

        if (jsonObject) {
            this.id = jsonObject[`${alias}id`] ?? null;
            this.postal_code = jsonObject[`${alias}postal_code`] ?? "";
            this.city = jsonObject[`${alias}city`] ?? "";
            this.address = jsonObject[`${alias}address`] ?? "";
        }
    }
  
    getClassName(): string 
    {
        return "Addresse";
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
            "address"
        ]; 
    }

    getNavigationKeys() : string[]
    {
        return []
    }

    public equals ( object : any)
    {
        if (!(object instanceof Addresse)) return false;

        if(object === this) return true

        return this.id === object.id ;
    }
}