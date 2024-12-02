import {NextRequest} from "next/server";
import {DonationCampaignManager} from "@/core/managers/DonationCampaignManager";
import {FormValidator} from "@/core/utils/FormValidator";
import * as yup from 'yup';
import {Responses} from "@/core/utils/Responses";
import {Services} from "@/services/Services";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {CampaignStatus} from "@/models/types/CampaignStatus";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";

const donationCampaignManager = new DonationCampaignManager();
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");

const updateFormSchema = yup.object().shape({
    title: yup.string().trim().nullable().min(1).max(200),
    description: yup.string().trim().nullable().min(1).max(2000),
    objective_value: yup.number().nullable().positive().min(0),
    category: yup.string().trim().nullable(),
    end_date: yup.date().nullable().min(new Date(), "End date must be in the future"),
    contact_email: yup.string().trim().nullable(),
    contact_phone_number: yup.string().trim().nullable(),
    status: yup.number().nullable().integer().positive().min(0).max(Object.keys(CampaignStatus).length / 2 - 1),
});
const updateFormValidator = new FormValidator(updateFormSchema);

export async function PATCH(request: NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const userId = await authorizationService.getId();
    if (userId == null) return Responses.createUnauthorizedResponse(); else if (!await authorizationService.hasRoles(UserRoleTypes.Admin, UserRoleTypes.CampaignManager)) return Responses.createForbiddenResponse();

    const bodyData = await request.formData();
    const validatorResult = await updateFormValidator.validate(Object.fromEntries(bodyData.entries()));

    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult?.value;
    if (formData == null) {
        return Responses.createBadRequestResponse();
    }

    const campaign = await donationCampaignManager.getById(params.id);
    if (campaign == null) {
        return Responses.createNotFoundResponse();
    }

    const isAdmin = await authorizationService.hasRole(UserRoleTypes.Admin);

    if (campaign.campaign_manager_id !== userId && !isAdmin) {
        return Responses.createForbiddenResponse("Only the creator of the campaign or the admin can update it.");
    }

    if (formData.status && [CampaignStatus.Approved, CampaignStatus.Reproved, CampaignStatus.InAnalysis].includes(formData.status) && !isAdmin) {
        return Responses.createForbiddenResponse();
    }

    const updatedFields = [];
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            campaign[key] = formData[key as keyof typeof formData];
            updatedFields.push(key);
        }
    }

    if (updatedFields.length == 0) {
        return Responses.createValidationErrorResponse(["Id can not be updated.", "No other fields to update."], "No fields for updated.");
    }

    const result = await donationCampaignManager.updateField(campaign, updatedFields);

    if (!result) {
        return Responses.createServerErrorResponse();
    }

    return Responses.createSuccessResponse({}, "Campaign Updated.");
}

export async function GET(context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const result = await donationCampaignManager.getById(params.id);
    if (result == null) {
        return Responses.createNotFoundResponse();
    }
    return Responses.createSuccessResponse(result.value);
}
