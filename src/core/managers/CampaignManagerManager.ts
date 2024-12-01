import { EntityManager } from "@/core/managers/EntityManager";
import { CampaignManager } from "@/models/CampaignManager";
import { OperationResult } from "@/core/utils/operation_result/OperationResult";
import { FormError } from "@/core/utils/operation_result/FormError";

export class CampaignManagerManager extends EntityManager<CampaignManager> {
    constructor() {
        super(CampaignManager);
    }

    /**
     * Create a new Campaign Manager.
     */
    async create(data: Partial<CampaignManager>): Promise<OperationResult<CampaignManager | null, FormError>> {
        const errors: FormError[] = [];

        // Validate required fields
        if (!data.description) {
            errors.push(new FormError("description", ["Description is required."]));
        } else if (data.description.length > 2000) {
            errors.push(new FormError("description", ["Max length is 2000 characters."]));
        }

        if (!data.contact_email) {
            errors.push(new FormError("contact_email", ["Contact email is required."]));
        }

        if (!data.type) {
            errors.push(new FormError("type", ["Type is required."]));
        }

        if (!data.identification_file_id) {
            errors.push(new FormError("identification_file_id", ["Identification file ID is required."]));
        }

        if (errors.length > 0) {
            return new OperationResult(null, errors);
        }

        // Create and save the Campaign Manager
        const entity = Object.assign(new CampaignManager(), data);
        const manager = await this.add(entity);

        return new OperationResult(manager, []);
    }

    /**
     * Update an existing Campaign Manager.
     */
    async update(data: Partial<CampaignManager> & { id: number }): Promise<OperationResult<CampaignManager | null, FormError>> {
        const errors: FormError[] = [];

        if (data.description && data.description.length > 2000) {
            errors.push(new FormError("description", ["Max length is 2000 characters."]));
        }

        if (errors.length > 0) {
            return new OperationResult(null, errors);
        }

        const existingEntity = await this.getById(data.id);
        if (!existingEntity) {
            return new OperationResult(null, [new FormError("id", ["Campaign Manager not found."])]);
        }

        Object.assign(existingEntity, data);
        const success = await this.update(existingEntity);

        return success
            ? new OperationResult(existingEntity, [])
            : new OperationResult(null, [new FormError("update", ["Failed to update Campaign Manager."])]);
    }



    async signUp(campaignManager: CampaignManager): Promise<OperationResult<CampaignManager | null, FormError>> {
        const errors: FormError[] = [];

        if (campaignManager.description!.length > 2000) {
             errors.push(new FormError("description", ["Max length is 2000 characters."]));
        }

        if (errors.length > 0 ) 
            return new OperationResult(null, errors);

        const manager = await this.repository.create(campaignManager);
        return new OperationResult(manager, errors);
    }
}