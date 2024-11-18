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

        if (campaignManager.type != UserRoleTypes.CampaignManager) {
            errors.push(new FormError("type", ["User must be a campaign manager"]));
        }

        const userManager = new UserManager();
        const createdUser = await userManager.signUp(campaignManager as User);

        if (createdUser.errors.length == 0 && createdUser.value) {
            campaignManager.id = createdUser.value.id;
            const createdDonor = await this.create(campaignManager);
            return new OperationResult(createdDonor, errors);
        }

        createdUser.errors.forEach(error => errors.push(error));

        return new OperationResult(null, errors);
    }

    async signIn(email: string, password: string): Promise<OperationResult<User | null, SimpleError>> {
        const userManager = new UserManager();
        return userManager.signIn(email, password);
    }
}