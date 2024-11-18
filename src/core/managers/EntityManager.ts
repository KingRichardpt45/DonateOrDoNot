import {Constrain} from "../repository/Constrain";
import {IEntity} from "../repository/IEntity";
import {IncludeNavigation} from "../repository/IncludeNavigation";
import {IRepositoryAsync} from "../repository/IRepositoryAsync";
import {RepositoryAsync} from "../repository/RepositoryAsync";
import {PrimaryKeyPart} from "@/core/repository/PrimaryKeyPart";

export class EntityManager<Entity extends IEntity> {
    protected readonly repository: IRepositoryAsync<Entity>;

    constructor(entityConstructor: new (...args: unknown[]) => Entity) {
        this.repository = new RepositoryAsync(entityConstructor);
    }

    async getById(id: number, id_field: string = "id", includeFunction: (entity: Entity) => IncludeNavigation[] = () => []): Promise<Entity | null> {
        return this.repository.getByPrimaryKey([new PrimaryKeyPart(id_field, id)], includeFunction);
    }

    async getAll(includeFunction: (entity: Entity) => IncludeNavigation[], orderBy: any[], limit: number, offset: number): Promise<Entity[] | null> {
        return this.repository.getAll(includeFunction, orderBy, limit, offset);
    }

    async getByCondition(constrains: Constrain[], includeFunction: (entity: Entity) => IncludeNavigation[], orderBy: any[], limit: number, offset: number): Promise<Entity[]> {
        return this.repository.getByCondition(constrains, includeFunction, orderBy, limit, offset);
    }

    async getFirstByCondition(constrains: Constrain[], includeFunction: (entity: Entity) => IncludeNavigation[], orderBy: any[], limit: number, offset: number): Promise<Entity | null> {
        return this.repository.getFirstByCondition(constrains, includeFunction, orderBy, limit, offset);
    }

    async exists(id: number): Promise<boolean> {
        return await this.getById(id) !== null;
    }

    async create(entity: Entity): Promise<Entity> {
        return this.repository.create(entity);
    }

    async update(entity: Entity): Promise<boolean> {
        return this.repository.update(entity);
    }

    async updateById(id: number): Promise<boolean> {
        const entity = await this.getById(id);
        return entity ? this.repository.update(entity) : false;
    }

    async updateField(entity: Entity, fields_to_update: { [key: string]: unknown }): Promise<boolean> {
        let updated = false;
        for (const field in fields_to_update) {
            if (field in entity) {
                (entity as any)[field] = fields_to_update[field];
                updated = true;
            }
        }
        return updated ? this.repository.update(entity) : false;
    }

    async updateFieldById(id: number, fields_to_update: { [key: string]: unknown }): Promise<boolean> {
        const entity = await this.getById(id);
        if (!entity) return false;

        let updated = false;
        for (const field in fields_to_update) {
            if (field in entity) {
                (entity as any)[field] = fields_to_update[field];
                updated = true;
            }
        }
        return updated ? this.repository.update(entity) : false;
    }

    async delete(entity: Entity): Promise<boolean> {
        return this.repository.delete(entity);
    }

    async deleteById(id: number): Promise<boolean> {
        const entity = await this.getById(id);
        return entity ? this.repository.delete(entity) : false;
    }
}