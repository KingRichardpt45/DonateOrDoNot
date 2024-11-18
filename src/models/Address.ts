import {Entity} from "@/core/repository/Entity";

export class Address extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    postal_code: string | null = null;
    city: string | null = null;
    address: string | null = null;
    specification: string | null = null;

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "postal_code", "city", "address", "door"];
    }

    getNavigationKeys(): string[] {
        return [];
    }

    getTableName(): string {
        return Address.getTableName();
    }

    getEntityName(): string {
        return Address.getEntityName();
    }

    static getTableName(): string {
        return "Addresses";
    }

    static getEntityName(): string {
        return "Address";
    }

    equalsToKnex(object: any , alias:string = ""): boolean 
    {
        return this.id === object[`${alias}id`] ;
    }
}