import {FileManager} from "@/core/managers/FileManager";
import {FormValidator} from "@/core/utils/FormValidator";
import {Responses} from "@/core/utils/Responses";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {FileService} from "@/services/FIleService";
import {Services} from "@/services/Services";
import {NextRequest} from "next/server";
import * as yup from 'yup';
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";

const fileManager = new FileManager();
const fileService = Services.getInstance().get<FileService>("FileService");
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");


const deleteFormSchema = yup.object().shape({
    user_id: yup.number().required().nonNullable().positive().integer(),
});

const deleteFormValidator = new FormValidator(deleteFormSchema);

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: number }>}) {
    const {id} = await context.params;

    if (!id) {
        return Responses.createNotFoundResponse();
    }

    const userId = await authorizationService.getId();
    if (!userId) {
        return Responses.createUnauthorizedResponse();
    }

    const bodyData = await request.formData();
    const validatorResult = await deleteFormValidator.validate(Object.fromEntries(bodyData.entries()));
    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult?.value;

    if (formData == null) {
        return Responses.createBadRequestResponse();
    }

    const resultFile = await fileManager.getById(id);
    if (!resultFile) {
        return Responses.createNotFoundResponse("No file was found with the provided id.");
    } else if (resultFile.user_id !== formData.user_id && await !authorizationService.hasRole(UserRoleTypes.Admin)) {
        return Responses.createForbiddenResponse();
    }

    const fileDeleted = await fileService.delete(resultFile);
    const recordDeleted = await fileManager.delete(resultFile);

    if (fileDeleted && recordDeleted) {
        return Responses.createSuccessResponse({}, "File Deleted.");
    } else {
        return Responses.createServerErrorResponse();
    }
}

export async function GET(request: Request, context: { params: Promise<{ id: number }>}) {
   
    const {id} = await context.params;

    if (! id) {
        return Responses.createNotFoundResponse();
    }

    const resultFileModel = await fileManager.getById(id);

    if (!resultFileModel) {
        return Responses.createNotFoundResponse("No file was found with the provided id.");
    }

    const stream = await fileService.createStream(resultFileModel);

    if (!stream) {
        return Responses.createServerErrorResponse();
    }

    return Responses.createResponseStream(stream, resultFileModel);
}
