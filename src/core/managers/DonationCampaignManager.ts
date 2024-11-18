import {EntityManager} from "@/core/managers/EntityManager";
import {Campaign} from "@/models/Campaign";
import {FormError} from "@/core/managers/FormError";
import {OperationResult} from "@/core/managers/OperationResult";
import {UserManager} from "@/core/managers/UserManager";
import {BankAccount} from "@/models/BankAccount";

export class DonationCampaignManager extends EntityManager<Campaign> {

    constructor() {
        super(Campaign);
    }

    async createCampaign(campaign: Campaign): Promise<OperationResult<Campaign | null, FormError>> {
        const errors: FormError[] = [];

        if (!campaign.title) {
            errors.push(new FormError("name", ["Name is required"]));
        }
        if (!campaign.description) {
            errors.push(new FormError("description", ["Description is required"]));
        }
        if (!campaign.objective_value) {
            errors.push(new FormError("objective_value", ["Objective value is required"]));
        }
        if (!campaign.current_donation_value) {
            campaign.current_donation_value = 0;
        } else if (campaign.objective_value && campaign.objective_value < 0) {
            errors.push(new FormError("objective_value", ["Objective value must be greater than 0"]));
        }

        if (!campaign.campaign_manager_id) {
            errors.push(new FormError("campaign_manager_id", ["Campaign manager is required"]));
        }
        if (!campaign.bank_account_id) {
            errors.push(new FormError("bank_account_id", ["Bank account is required"]));
        }


        if (campaign.campaign_manager_id) {
            const userManager = new UserManager();
            const campaignManagerExists = await userManager.exists(campaign.campaign_manager_id);
            if (!campaignManagerExists) {
                errors.push(new FormError("campaign_manager_id", ["Campaign manager does not exist"]));
            }
        }

        if (campaign.bank_account_id) {
            const bankAccountManager = new EntityManager(BankAccount);
            const bankAccountExists = await bankAccountManager.exists(campaign.bank_account_id);
            if (!bankAccountExists) {
                errors.push(new FormError("bank_account_id", ["Bank account does not exist"]));
            }
        }

        const createdCampaign = errors.length == 0 ? await this.create(campaign) : null;
        return new OperationResult(createdCampaign, errors);
    }
}