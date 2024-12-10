import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {Services} from "@/services/Services";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {NextRequest} from "next/server";
import {DonationManager} from "@/core/managers/DonationManager";
import {FormValidator} from "@/core/utils/FormValidator";
import * as yup from 'yup';
import {Responses} from "@/core/utils/Responses";
import {YupUtils} from "@/core/utils/YupUtils";

const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const donationManager = new DonationManager();

const putFormSchema = yup.object().shape({
    campaign_id: yup.number().required().nonNullable().positive().integer(),
    donor_id: yup.number().required().nonNullable().positive().integer(),
    comment: yup.string().required().nonNullable().trim().min(1).max(2000),
    value: yup.number().required().nonNullable().positive(),
    nameHidden: yup.boolean().required().nonNullable(),
});

const putFormValidator = new FormValidator(putFormSchema);

export async function PUT(request: NextRequest) {
    if (!await authorizationService.hasRoles(UserRoleTypes.Donor)) {
        return Responses.createForbiddenResponse();
    }

    const formBody = await request.formData();
    const validatorResult = await putFormValidator.validate(Object.fromEntries(formBody.entries()));
    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult.value!;
    const result = await donationManager.create(formData.campaign_id, formData.donor_id, formData.comment, formData.value, formData.nameHidden);

    if (!result.isOK) {
        return Responses.createValidationErrorResponse(result.errors);
    }

    return Responses.createSuccessResponse(result.value);
}


const getFormSchema = yup.object().shape({
    donor_id: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer(),
    pageSize: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().integer().positive(),
    page: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().integer().positive().min(0),
});

const getFormValidator = new FormValidator(getFormSchema);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const validatorResult = await getFormValidator.validate(Object.fromEntries(searchParams.entries()), false);
    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult.value!;
    const donationsResult = await donationManager.getDonationsOfDonor(formData.donor_id, formData.page, formData.pageSize);

    if (!donationsResult.isOK) {
        return Responses.createValidationErrorResponse(donationsResult.errors);
    }

    return Responses.createSuccessResponse(donationsResult.value);
}