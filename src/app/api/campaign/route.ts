import {NextRequest} from "next/server";
import {DonationCampaignManager} from "@/core/managers/DonationCampaignManager";
import {FormValidator} from "@/core/utils/FormValidator";
import * as yup from 'yup';
import {Responses} from "@/core/utils/Responses";
import {BankAccountManager} from "@/core/managers/BankAccountManager";
import {CampaignStatus} from "@/models/types/CampaignStatus";
import {YupUtils} from "@/core/utils/YupUtils";
import {Constraint} from "@/core/repository/Constraint";
import {Operator} from "@/core/repository/Operator";
import {FormError} from "@/core/utils/operation_result/FormError";

const donationCampaignManager = new DonationCampaignManager();
const bankManager = new BankAccountManager();

const putFormSchema = yup.object().shape({
    title: yup.string().trim().required().nonNullable().min(1).max(200),
    description: yup.string().trim().required().nonNullable().min(1).max(2000),
    objective_value: yup.number().required().nonNullable().positive().min(0),
    category: yup.string().trim().required().nonNullable(),
    end_date: yup.date().required().nonNullable().min(new Date(), "end_date must be in the future"),
    contact_email: yup.string().trim().required().nonNullable(),
    contact_phone_number: yup.string().trim().required().nonNullable(),
    campaign_manager_id: yup.number().required().nonNullable().positive().integer().min(0),
    iban: yup.string().trim().required().nonNullable().min(1).max(34),
    account_holder: yup.string().trim().required().nonNullable(),
    bank_name: yup.string().trim().required().nonNullable(),
});
const putFormValidator = new FormValidator(putFormSchema);

export async function PUT(request: NextRequest) {
    const bodyData = await request.formData();
    const validatorResult = await putFormValidator.validate(Object.fromEntries(bodyData.entries()));

    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult.value!;
    const campaigns = await donationCampaignManager.getByCondition([new Constraint("campaign_manager_id", Operator.EQUALS, formData.campaign_manager_id), new Constraint("status", Operator.IN, [CampaignStatus.Active, CampaignStatus.Approved, CampaignStatus.InAnalysis])], () => [], [], 6, 0);

    if (campaigns.length > 5) {
        return Responses.createValidationErrorResponse([new FormError("Max Campaigns reached!", ["Can not have more then 5 in Active,Analyses or Approved"])]);
    }

    const bankAccount = await bankManager.create(formData.iban, formData.account_holder, formData.account_holder);

    const campaignResult = await donationCampaignManager.create(formData.title, formData.description, formData.objective_value, formData.category, formData.end_date, formData.contact_email, formData.contact_phone_number, 1, formData.campaign_manager_id, bankAccount.id);

    if (!campaignResult.isOK) {
        return Responses.createValidationErrorResponse(campaignResult.errors);
    }

    return Responses.createSuccessResponse(campaignResult.value);
}

const searchFormSchema = yup.object().shape({
    query: yup.string().lowercase().trim().notRequired().nonNullable().min(0),
    pageSize: yup.number().transform(YupUtils.convertToNumber).required().integer().min(0),
    page: yup.number().transform(YupUtils.convertToNumber).required().integer().min(0),
    category: yup.string().trim().nonNullable().min(1),
    value: yup.number().transform(YupUtils.convertToNumber).positive().nonNullable(),
    managerId: yup.number().transform(YupUtils.convertToNumber).min(0).nonNullable(),
    status: yup.number().transform(YupUtils.convertToNumber).nonNullable(),
});

const searchFormValidator = new FormValidator(searchFormSchema);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const validatorResult = await searchFormValidator.validate(Object.fromEntries(searchParams.entries()));

    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult.value!;
    const constraints: Constraint[] = [];

    if (formData.value) {
        constraints.push(new Constraint("objective_value", Operator.GREATER_EQUALS, formData.value));
    }

    if (formData.category) {
        constraints.push(new Constraint("category", Operator.EQUALS, formData.category));
    }

    if (formData.managerId) {
        constraints.push(new Constraint("campaign_manager_id", Operator.EQUALS, formData.managerId));
    }

    if (formData.status) {
        constraints.push(new Constraint("status", Operator.EQUALS, formData.status));
    }
    if (formData.query) {
        constraints.push(new Constraint("title", Operator.LIKE, `%${formData.query}%`));
        constraints.push(new Constraint("description", Operator.LIKE, `%${formData.query}%`));
    }

    const result = await donationCampaignManager.searchWithConstraints(constraints, formData.page, formData.pageSize);

    if (result.isOK) {
        return Responses.createSuccessResponse(result.value);
    } else {
        return Responses.createNotFoundResponse("No item where found with the provided search.");
    }
}
