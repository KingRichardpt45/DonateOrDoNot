import { IEntity } from "@/core/repository/IEntity";

export class Address implements IEntity {
    [key: string]: unknown;

    id: number | null = null;
    postal_code: string | null = null;
    city: string | null = null;
    address: string | null = null;
    door: string | null = null;

    constructor() 
    {
        this.id = null;
        this.postal_code = null;
        this.city = null;
        this.address = null;  
        this.door = null; 
    }

    getTableName(): string {
        return Address.getTableName();
    }

    isCreated(): boolean {
        return this.id !== null;
    }

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "postal_code", "city", "address", "door"];
    }

    getNavigationKeys(): string[] {
        return [];
    }

    equals(object: unknown): boolean {
        return object instanceof Address && this.id === object.id;
    }

    static getTableName(): string {
        return "Address";
    }

    static getEntityName(): string {
        return "Addresses";
    }

    equalsToKnex(object: any , alias:string = ""): boolean 
    {
        return this.id === object[`${alias}id`] ;
    }
}