import {Entity} from "@/core/repository/Entity";

export class BankAccount extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    iban: string | null = null;
    account_holder: string | null = null;
    bank_name: string | null = null;

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", "iban", "account_holder", "bank_name"];
    }

    getNavigationKeys(): string[] {
        return [];
    }

    getTableName(): string {
        return BankAccount.getTableName();
    }

    getEntityName(): string {
        return BankAccount.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof BankAccount && this.id === object.id;
    }

    static getTableName(): string {
        return "BankAccounts";
    }

    static getEntityName(): string {
        return "BankAccount";
    }
}