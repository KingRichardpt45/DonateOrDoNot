import {IEntity} from "@/core/repository/IEntity";

export abstract class Entity implements IEntity {
    [key: string]: any;

    abstract id: number | null;

    isCreated(): boolean {
        return this.id !== null;
    }

    abstract getPrimaryKeyParts(): string[];

    abstract getKeys(): string[];

    abstract getNavigationKeys(): string[];

    abstract getTableName(): string;

    abstract getEntityName(): string;

    abstract equals(object: unknown): boolean

    equalsToKnex(object: unknown, alias: string = ""): boolean {
        if (typeof object === "object" && object !== null && `${alias}id` in object) {
            return this.id === (object as Record<string, unknown>)[`${alias}id`];
        }
        return false;
    }
}