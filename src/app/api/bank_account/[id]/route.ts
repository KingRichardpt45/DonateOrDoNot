import {NextRequest} from "next/server";
import {EntityManager} from "@/core/managers/EntityManager";
import {BankAccount} from "@/models/BankAccount";
import * as yup from "yup";
import {FormValidator} from "@/core/utils/FormValidator";
import {Services} from "@/services/Services";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {Responses} from "@/core/utils/Responses";

const bankAccountManager = new EntityManager(BankAccount);
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");

const updateBankAccountSchema = yup.object().shape({
    iban: yup.string().trim().nullable().min(1).max(34),
    account_holder: yup.string().trim().nullable().min(1),
    bank_name: yup.string().trim().nullable().min(1),
});
const updateBankAccountValidator = new FormValidator(updateBankAccountSchema);

export async function PATCH(request: NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    if (!await authorizationService.hasRoles(UserRoleTypes.Admin, UserRoleTypes.CampaignManager)) {
        return Responses.createForbiddenResponse();
    }

    const bodyData = await request.formData();
    const validatorResult = await updateBankAccountValidator.validate(Object.fromEntries(bodyData.entries()));

    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult.value!;
    const bankAccount = await bankAccountManager.getById(params.id);
    if (!bankAccount) {
        return Responses.createNotFoundResponse();
    }

    const updatedFields: string[] = [];

    for (const key in formData) {
        if (key !== "id") {
            bankAccount[key] = formData[key as keyof typeof formData];
            updatedFields.push(key);
        }
    }

    if (updatedFields.length === 0) {
        return Responses.createValidationErrorResponse(["Id cannot be updated.", "No other fields to update."], "No fields for update.");
    }

    const result = await bankAccountManager.updateField(bankAccount, updatedFields);

    if (!result) {
        return Responses.createServerErrorResponse();
    }

    return Responses.createSuccessResponse({}, "Bank Account Updated.");
}

export async function GET(context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const result = await bankAccountManager.getById(params.id);
    if (result == null) {
        return Responses.createNotFoundResponse();
    }
    return Responses.createSuccessResponse(result.value);
}
