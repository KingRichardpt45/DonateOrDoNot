import {Badge} from "@/models/Badge";
import {EntityManager} from "./EntityManager";
import {BadgeTypes} from "@/models/types/BadgeTypes";
import {SearchableEntity} from "./SerachableEntity";
import {Constraint} from "../repository/Constraint";
import {OperationResult} from "../utils/operation_result/OperationResult";
import {SimpleError} from "../utils/operation_result/SimpleError";
import {IncludeNavigation} from "../repository/IncludeNavigation";

export class BadgeManager extends EntityManager<Badge> implements SearchableEntity<Badge> {
    constructor() {
        super(Badge);
    }

    async create(name: string, description: string, type: BadgeTypes, unit: string | null, value: number | null, imageId: number): Promise<Badge> {
        const badge = new Badge();
        badge.name = name;
        badge.description = description;
        badge.type = type;
        badge.unit = unit ? unit : "";
        badge.value = value ? value : 0;
        badge.image_id = imageId;

        return this.add(badge);
    }

    async searchWithConstraints(constraints: Constraint[], page: number, pageSize: number): Promise<OperationResult<Badge[], SimpleError>> {
        const inNamesResult = await this.repository.getByCondition(constraints, (badge) => [new IncludeNavigation(badge.image, 0)], [], pageSize, page * pageSize);

        const inDescriptionResult = await this.repository.getByCondition(constraints, (badge) => [new IncludeNavigation(badge.image, 0)], [], pageSize, page * pageSize);

        inDescriptionResult.forEach((value) => inNamesResult.push(value));

        if (inNamesResult.length == 0) return new OperationResult([], [new SimpleError("No items where found.")]); else return new OperationResult(inNamesResult, []);
    }
}