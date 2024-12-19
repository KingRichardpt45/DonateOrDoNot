import {Constraint} from "../repository/Constraint";
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

    async getById(id: number, includeFunction: (entity: Entity) => IncludeNavigation[] = () => []): Promise<Entity | null> {
        return this.repository.getByPrimaryKey([new PrimaryKeyPart("id", id)], includeFunction);
    }

    async getAll(includeFunction: (entity: Entity) => IncludeNavigation[] = ()=>[], orderBy: any[] = [], limit: number = 0, offset: number = 0): Promise<Entity[] | null> {
        return this.repository.getAll(includeFunction, orderBy, limit, offset);
    }

    async getByCondition(constraints: Constraint[], includeFunction: (entity: Entity) => IncludeNavigation[] = ()=>[], orderBy: any[] = [], limit: number = 0, offset: number = 0): Promise<Entity[]> {
        return this.repository.getByCondition(constraints, includeFunction, orderBy, limit, offset);
    }

    async getFirstByCondition(constraints: Constraint[], includeFunction: (entity: Entity) => IncludeNavigation[] = ()=>[], orderBy: any[] = [], limit: number = 0, offset: number = 0): Promise<Entity | null> {
        return this.repository.getFirstByCondition(constraints, includeFunction, orderBy, limit, offset);
    }

    async exists(id: number): Promise<boolean> {
        return await this.getById(id) !== null;
    }

    async add(entity: Entity): Promise<Entity> {
        return this.repository.create(entity);
    }

    async update(entity: Entity): Promise<boolean> {
        return this.repository.update(entity);
    }

    async updateById(id: number): Promise<boolean> {
        const entity = await this.getById(id);
        return entity ? this.repository.update(entity) : false;
    }

    async updateField(entity: Entity, fields_to_update:string[]): Promise<boolean> {
        return  this.repository.updateFields(entity, ...fields_to_update ) ;
    }

    async delete(entity: Entity): Promise<boolean> {
        return this.repository.delete(entity);
    }

    async deleteById(id: number): Promise<boolean> {
        const entity = await this.getById(id);
        return entity ? this.repository.delete(entity) : false;
    }
}