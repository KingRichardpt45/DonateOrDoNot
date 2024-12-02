import {NextRequest} from "next/server";
import {FormValidator} from "@/core/utils/FormValidator";
import {DonorManager} from "@/core/managers/DonorManager";
import {FileManager} from "@/core/managers/FileManager";
import * as yup from 'yup';
import {FileTypes} from "@/models/types/FileTypes";
import {Services} from "@/services/Services";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {BadgeManager} from "@/core/managers/BadgeManager";
import {BadgeTypes} from "@/models/types/BadgeTypes";
import {IUserProvider} from "@/services/session/userProvider/IUserProvider";
import {FileService} from "@/services/FIleService";
import {Responses} from "@/core/utils/Responses";
import {FormError} from "@/core/utils/operation_result/FormError";

const badgeManager = new BadgeManager();
const donorManager = new DonorManager();
const fileManager = new FileManager();
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const fileService = Services.getInstance().get<FileService>("FileService");

export async function DELETE(request: NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    if (!await authorizationService.hasRoles(UserRoleTypes.Admin)) return Responses.createForbiddenResponse();

    if (await badgeManager.deleteById(params.id)) return Responses.createSuccessResponse(); else return Responses.createNotFoundResponse();
}

const unlockFormSchema = yup.object().shape({
    donor_id: yup.number().required().integer().positive().nonNullable()
});
const unlockFormValidator = new FormValidator(unlockFormSchema);

export async function POST(request: NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    if (!await authorizationService.hasRoles(UserRoleTypes.Donor)) return Responses.createForbiddenResponse();

    const formBody = await request.formData();
    const validatorResult = await unlockFormValidator.validate(Object.fromEntries(formBody.entries()));

    if (!validatorResult.isOK) return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;
    const unlockResult = await donorManager.unlockBadge(formData.donor_id, params.id);

    if (!unlockResult.isOK) return Responses.createValidationErrorResponse(unlockResult.errors);

    return Responses.createSuccessResponse();
}

export async function GET(context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const result = await badgeManager.getById(params.id);
    if (result == null) {
        return Responses.createNotFoundResponse();
    }
    return Responses.createSuccessResponse(result.value);
}

const updateFormSchema = yup.object().shape({
    name: yup.string().trim().nullable().min(1).max(100),
    description: yup.string().trim().nullable().min(1).max(200),
    type: yup.number().integer().positive().nullable().min(0).max(Object.keys(BadgeTypes).length / 2 - 1),
    unit: yup.string().trim().nullable(),
    value: yup.number().integer().positive().nullable(),
    imageFile: fileService.filesSchemaNotRequire
});
const updateFormValidator = new FormValidator(updateFormSchema);

export async function PATCH(request: NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const user = await userProvider.getUser();
    if (user == null || (user.type != UserRoleTypes.Admin && user.type != UserRoleTypes.CampaignManager)) return Responses.createForbiddenResponse();

    const formBody = await request.formData();
    const validatorResult = await updateFormValidator.validate(Object.fromEntries(formBody.entries()));

    if (!validatorResult.isOK) return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;
    const badge = await badgeManager.getById(params.id);

    if (badge == null) return Responses.createNotFoundResponse();

    if ((badge.type === BadgeTypes.FrequencyOfDonations || badge.type === BadgeTypes.TotalDonations || badge.type === BadgeTypes.TotalValueDonated) && user.type != UserRoleTypes.Admin) return Responses.createForbiddenResponse();

    const updatedFields = [];
    for (const key in formData) {
        if (key == "imageFile") {
            const uploadedFile = formData[key] as File;
            const fileResult = await fileManager.create(uploadedFile.name, fileService.savePath, uploadedFile.type, FileTypes.Image, uploadedFile.size, user.id!);

            if (!fileResult.isOK) return Responses.createValidationErrorResponse(fileResult.errors);

            if (!await fileService.save(fileResult.value!, uploadedFile)) return Responses.createServerErrorResponse();

            updatedFields.push("image_id");
            badge.image_id = fileResult.value!.id;
        } else {
            badge[key] = formData[key as keyof typeof formData];
            updatedFields.push(key);
        }
    }

    if (updatedFields.length == 0) return Responses.createValidationErrorResponse(new FormError("id", ["Id can not be updated.", "Id can not be the only field in request."]));

    if (!await badgeManager.updateField(badge, updatedFields)) return Responses.createServerErrorResponse();

    return Responses.createSuccessResponse({}, "Badge updated.");
}
