import {NextRequest} from "next/server";
import {StoreItemManager} from "@/core/managers/StoreItemManager";
import * as yup from 'yup';
import {FormValidator} from "@/core/utils/FormValidator";
import {FileManager} from "@/core/managers/FileManager";
import {File as ModelFile} from "@/models/File";
import {FileTypes} from "@/models/types/FileTypes";
import {Services} from "@/services/Services";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {FileService} from "@/services/FIleService";
import {Responses} from "@/core/utils/Responses";

const storeItemManager = new StoreItemManager();
const fileManager = new FileManager();
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const fileService = Services.getInstance().get<FileService>("FileService");

export async function DELETE(req:NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    if (await authorizationService.hasRole(UserRoleTypes.Admin)) {
        return Responses.createUnauthorizedResponse();
    }

    if (!await storeItemManager.deleteById(params.id)) return Responses.createNotFoundResponse("No item was found with the provided id."); else return Responses.createSuccessResponse();
}

export async function GET(req:NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const result = await storeItemManager.getById(params.id);
    if (result) return Responses.createSuccessResponse(result); else return Responses.createNotFoundResponse("No item where found with the provided id.");
}

const updateFormSchema = yup.object().shape({
    cost: yup.number().integer().positive().nonNullable(),
    description: yup.string().trim().nonNullable().min(1).max(200),
    name: yup.string().trim().nonNullable().min(1).max(100),
    imageFile: fileService.filesSchema
});
const updateFormValidator = new FormValidator(updateFormSchema);

export async function PATCH(request: NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const userId = await authorizationService.getId();
    if (!userId || !await authorizationService.hasRole(UserRoleTypes.Admin)) return Responses.createUnauthorizedResponse();

    const formBody = await request.formData();
    const validatorResult = await updateFormValidator.validate(Object.fromEntries(formBody.entries()));

    if (!validatorResult.isOK) return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult?.value;
    if (!formData) return Responses.createBadRequestResponse();

    const storeItem = await storeItemManager.getById(params.id);
    if (!storeItem) return Responses.createNotFoundResponse();

    const updatedFields = [];
    for (const key in formData) {
        if (key == "imageFile") {
            const oldFile = await fileManager.getById(storeItem.image_id!) as ModelFile;
            const uploadedFile = formData.imageFile as File;
            const fileResult = await fileManager.create(uploadedFile.name, fileService.savePath, uploadedFile.type, FileTypes.Image, uploadedFile.size, userId);
            if (!fileResult.isOK) return Responses.createValidationErrorResponse(fileResult.errors);
            await fileService.update(oldFile, fileResult.value!, uploadedFile)
        } else {
            storeItem[key] = formData[key as keyof typeof formData];
            updatedFields.push(key);
        }
    }

    if (updatedFields.length == 0) return Responses.createValidationErrorResponse(["Id can not be updated.", "No other fields to update."], "No fields for updated.")

    const updated = await storeItemManager.updateField(storeItem, updatedFields);

    if (updated) return Responses.createSuccessResponse(); else return Responses.createServerErrorResponse();
}