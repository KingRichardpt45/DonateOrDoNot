import {EntityManager} from "@/core/managers/EntityManager";
import {Campaign} from "@/models/Campaign";
import {FormError} from "@/core/utils/operation_result/FormError";
import {OperationResult} from "@/core/utils/operation_result/OperationResult";
import {UserManager} from "@/core/managers/UserManager";
import {RepositoryAsync} from "../repository/RepositoryAsync";
import {TotalDonatedValue} from "@/models/TotalDonatedValue";
import {Constraint} from "../repository/Constraint";
import {Operator} from "../repository/Operator";
import {Donor} from "@/models/Donor";
import {SimpleError} from "../utils/operation_result/SimpleError";
import {IncludeNavigation} from "../repository/IncludeNavigation";
import {CampaignStatus} from "@/models/types/CampaignStatus";
import {BankAccountManager} from "./BankAccountManager";
import {SearchableEntity} from "./SerachableEntity";

export class DonationCampaignManager extends EntityManager<Campaign> implements SearchableEntity<Campaign> {

    private readonly totalValuesDonatedRepository: RepositoryAsync<TotalDonatedValue>;
    private readonly userManager: UserManager;
    private readonly bankAccountManager: BankAccountManager;


    constructor() {
        super(Campaign);
        this.totalValuesDonatedRepository = new RepositoryAsync(TotalDonatedValue);
        this.userManager = new UserManager();
        this.bankAccountManager = new BankAccountManager();
    }

    async create(title: string | null, description: string | null, objectiveValue: number | null, category: string | null, endDate: Date | null, contactEmail: string | null, contactPhoneNumber: string | null, intervalNotificationValue: number, campaignManagerId: number | null, bankAccountId: number | null): Promise<OperationResult<Campaign | null, FormError>> {
        const campaign = new Campaign();

        campaign.campaign_manager_id = campaignManagerId;
        campaign.bank_account_id = bankAccountId;
        campaign.title = title;
        campaign.description = description;
        campaign.objective_value = objectiveValue;
        campaign.current_donation_value = 0;
        campaign.category = category;
        campaign.end_date = endDate;
        campaign.contact_email = contactEmail;
        campaign.contact_phone_number = contactPhoneNumber;
        campaign.donation_counter = 0;
        campaign.last_notified_value = 0;
        campaign.interval_notification_value = intervalNotificationValue;
        campaign.status = CampaignStatus.InAnalysis;

        const errors = []
        if (!await this.userManager.exists(campaign.campaign_manager_id!)) {
            errors.push(new FormError("campaign_manager_id", ["Campaign manager does not exist"]));
        }

        if (!await this.bankAccountManager.exists(campaign.bank_account_id!)) {
            errors.push(new FormError("bank_account_id", ["Bank account does not exist"]));
        }

        const createdCampaign = errors.length == 0 ? await this.repository.create(campaign) : null;
        return new OperationResult(createdCampaign, errors);
    }

    async getTopDonors(campaign_id: number, page: number, pageSize: number): Promise<OperationResult<Donor[] | null, SimpleError>> {
        const totalValuesDonated = await this.totalValuesDonatedRepository.getByCondition([new Constraint("id", Operator.EQUALS, campaign_id)], (totalDonatedValue) => [new IncludeNavigation(totalDonatedValue.donor, 0), new IncludeNavigation((new Donor).user,1)], [{
            column: `${TotalDonatedValue.getTableName()}.total_value`,
            order: "desc"
        }], pageSize, page * pageSize,)

        const donors: Donor[] = [];
        totalValuesDonated.forEach((totalValueDonated) => donors.push(totalValueDonated.donor.value! as Donor))

        if (donors.length == 0) return new OperationResult(null, [new SimpleError("No results where found.")]); else return new OperationResult(donors, []);
    }

    async searchWithConstraints(constraints: Constraint[], page: number, pageSize: number): Promise<OperationResult<Campaign[], SimpleError>> 
    {
        const inNamesResult = await this.repository.getByCondition(constraints, (campaign) => [new IncludeNavigation(campaign.files, 0)], [], pageSize , page * pageSize);

        if (inNamesResult.length == 0) return new OperationResult([], [new SimpleError("No items where found.")]); else return new OperationResult(inNamesResult, []);
    }
}
