import {User} from "@/models/User";
import {EntityManager} from "@/core/managers/EntityManager";
import {OperationResult} from "@/core/managers/OperationResult";
import {FormError} from "@/core/managers/FormError";
import {UserManager} from "@/core/managers/UserManager";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {SimpleError} from "@/core/managers/SimpleError";
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