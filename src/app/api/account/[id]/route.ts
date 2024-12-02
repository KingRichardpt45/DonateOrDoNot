import {Services} from "@/services/Services";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {NextRequest} from "next/server";
import {Responses} from "@/core/utils/Responses";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {UserManager} from "@/core/managers/UserManager";
import * as yup from "yup";
import {FormValidator} from "@/core/utils/FormValidator";
import {CampaignManagerTypes} from "@/models/types/CampaignManagerTypes";
import {FileService} from "@/services/FIleService";

const userManager = new UserManager();

const fileService = Services.getInstance().get<FileService>("FileService");
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");

const updateAccountSchema = yup.object().shape({
    name: yup.string().trim().required().nullable().min(1),
    email: yup.string().trim().required().nullable().min(1),
    password: yup.string().trim().required().nullable().min(1),
    passwordConfirm: yup.string().trim().required().nullable().min(1),
    postalCode: yup.string().trim().required().nullable().min(1),
    city: yup.string().trim().required().nullable().min(1),
    address: yup.string().trim().required().nullable().min(1),
    addressSpecification: yup.string().trim().required().nullable().min(1),
    type: yup.number().required().nullable().min(0).max(1),
});
const updateAccountValidator = new FormValidator(updateAccountSchema);

const managerFormSchema = yup.object().shape({
    contactEmail: yup.string().trim().required().nullable().min(1),
    description: yup.string().trim().required().nullable().min(1).max(200),
    managerType: yup.number().required().nullable().min(0).max(Object.keys(CampaignManagerTypes).length / 2 - 1),
    identificationFile: fileService.filesSchema
});
const managerFormValidator = new FormValidator(managerFormSchema);

export async function PATCH(request: NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    if (!await authorizationService.hasRoles(UserRoleTypes.Admin, UserRoleTypes.CampaignManager)) {
        return Responses.createForbiddenResponse();
    }

    const bodyData = await request.formData();
    const validatorResult = await updateAccountValidator.validate(Object.fromEntries(bodyData.entries()));

    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult.value;

    if (formData == null) {
        return Responses.createBadRequestResponse();
    }

    const user = await userManager.getById(params.id);
    if (!user) {
        return Responses.createNotFoundResponse();
    }

    const updatedFields: string[] = [];

    for (const key in formData) {
        if (key !== "id") {
            user[key] = formData[key as keyof typeof formData];
            updatedFields.push(key);
        }
    }

    if (user.type == UserRoleTypes.CampaignManager || formData.type == UserRoleTypes.CampaignManager) {
        const managerValidatorResult = await managerFormValidator.validate(Object.fromEntries(bodyData.entries()));
        if (!managerValidatorResult.isOK) {
            return Responses.createValidationErrorResponse(managerValidatorResult.errors);
        }

        const formDataManager = managerValidatorResult.value;

        if (formDataManager == null) {
            return Responses.createBadRequestResponse();
        }

        for (const key in formDataManager) {
            user[key] = formDataManager[key as keyof typeof formDataManager];
            updatedFields.push(key);
        }
    }

    if (updatedFields.length === 0) {
        return Responses.createValidationErrorResponse(["Id cannot be updated.", "No other fields to update."], "No fields for update.");
    }

    const result = await userManager.updateField(user, updatedFields);

    if (!result) {
        return Responses.createServerErrorResponse();
    }

    return Responses.createSuccessResponse({}, "Account Updated.");
}

export async function DELETE(context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const userId = await authorizationService.getId();
    if (userId == null) return Responses.createUnauthorizedResponse();

    const isAdmin = await authorizationService.hasRole(UserRoleTypes.Admin);

    if (!isAdmin && userId != params.id) return Responses.createForbiddenResponse();

    if (await userManager.deleteById(params.id)) return Responses.createSuccessResponse(); else return Responses.createNotFoundResponse();
}
