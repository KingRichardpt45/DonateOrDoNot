import {User} from "@/models/User";
import {EntityManager} from "@/core/managers/EntityManager";
import {OperationResult} from "@/core/utils/operation_result/OperationResult";
import {FormError} from "@/core/utils/operation_result/FormError";
import {UserManager} from "@/core/managers/UserManager";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {SimpleError} from "@/core/utils/operation_result/SimpleError";
import {CampaignManager} from "@/models/CampaignManager";

export class CampaignManagerManager extends EntityManager<CampaignManager> {

    constructor() {
        super(CampaignManager);
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