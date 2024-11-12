import { IEntity } from "@/core/repository/IEntity";

export class Address implements IEntity {
    [key: string]: unknown;

    id: number | null = null;
    postal_code: string | null = null;
    city: string | null = null;
    address: string | null = null;
    door: string | null = null;

    getEntityName(): string {
        return Address.getEntityName();
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
}