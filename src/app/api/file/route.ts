import {FileManager} from "@/core/managers/FileManager";
import {FormValidator} from "@/core/utils/FormValidator";
import {Responses} from "@/core/utils/Responses";
import {FileTypes} from "@/models/types/FileTypes";
import {FileService} from "@/services/FIleService";
import {Services} from "@/services/Services";
import {NextRequest} from "next/server";
import * as yup from 'yup';
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";

const fileManager = new FileManager();
const fileService = Services.getInstance().get<FileService>("FileService");
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");

const putFormSchema = yup.object().shape({
    type: yup.number().required().integer().positive().nonNullable().min(0).max(Object.keys(FileTypes).length / 2 - 1),
    campaign_id: yup.number().nonNullable().positive().integer(),
    imageFile: fileService.filesSchema
});

const putFormValidator = new FormValidator(putFormSchema);

export async function PUT(request: NextRequest) {
    const userId = await authorizationService.getId();
    if (!userId) {
        return Responses.createUnauthorizedResponse();
    }

    const bodyData = await request.formData();
    const validatorResult = await putFormValidator.validate(Object.fromEntries(bodyData.entries()));
    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult?.value;

    if (formData == null) return Responses.createServerErrorResponse();

    const uploadedFile = formData.imageFile as File;
    const resultFile = await fileManager.create(uploadedFile.name, fileService.savePath, uploadedFile.type, formData.type, uploadedFile.size, userId, formData.campaign_id);

    if (!resultFile || !resultFile.isOK || !resultFile.value) {
        return Responses.createValidationErrorResponse(resultFile.errors);
    }

    const fileSaved = await fileService.save(resultFile.value, uploadedFile);
    if (fileSaved) {
        return Responses.createSuccessResponse(resultFile.value, `Uploaded ${resultFile.value?.original_name} successfully.`);
    } else {
        return Responses.createServerErrorResponse();
    }
}
