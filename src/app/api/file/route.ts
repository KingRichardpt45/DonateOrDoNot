import { FileManager } from "@/core/managers/FileManager";
import { FormValidator } from "@/core/utils/FormValidator";
import { Responses } from "@/core/utils/Responses";
import { YupUtils } from "@/core/utils/YupUtils";
import { FileTypes } from "@/models/types/FileTypes";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { FileService } from "@/services/FIleService";
import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { NextRequest } from "next/server";
import * as yup from 'yup';

const fileManager = new FileManager();
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const fileService = Services.getInstance().get<FileService>("FileService");
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

const putFormSchema = yup.object().shape(
    {
        type: yup.number().required().integer().positive().nonNullable().min(0).max( Object.keys(FileTypes).length /2 - 1),
        user_id: yup.number().required().nonNullable().positive().integer(),
        campaign_id: yup.number().required().nullable().positive().integer(),
        imageFile: fileService.filesSchema
    }
);
const putFormValidator = new FormValidator(putFormSchema);

export async function PUT( request : NextRequest )
{   
    const user = await userProvider.getUser();
    if( !user )
        return Responses.createUnauthorizedResponse();

    const bodyData = await request.formData();
    const validatorResult = await putFormValidator.validate( Object.fromEntries( bodyData.entries() ) );
    if(! validatorResult.isOK )
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;
    const uploadedFile = formData.imageFile as File;
    const resultFile = await fileManager.create(uploadedFile.name,fileService.savePath,uploadedFile.type,formData.type,formData.user_id,formData.campaign_id);

    if(!resultFile.isOK)
        return Responses.createValidationErrorResponse(resultFile.errors);
    
    if( await fileService.save(resultFile.value!,uploadedFile) )
        return Responses.createSuccessResponse(resultFile.value);
    else
        return Responses.createServerErrorResponse();
}




const deleteFormSchema = yup.object().shape(
    {
        id: yup.number().required().nonNullable().positive().integer(),
        user_id: yup.number().required().nonNullable().positive().integer(),
    }
);
const deleteFormValidator = new FormValidator(deleteFormSchema);

export async function DELETE( request : NextRequest )
{   
    const user = await userProvider.getUser();
    if( !user )
        return Responses.createUnauthorizedResponse();

    const bodyData = await request.formData();
    const validatorResult = await deleteFormValidator.validate( Object.fromEntries( bodyData.entries() ) );
    if(! validatorResult.isOK )
        return Responses.createValidationErrorResponse(validatorResult.errors);
    
    const formData = validatorResult.value!;
    const resultFile = await fileManager.getById(formData.id);
    if(resultFile == null)
        return Responses.createNotFoundResponse("No file where found with the provided id.");
    else if (resultFile.user_id != formData.user_id && user.type != UserRoleTypes.Admin)
        return Responses.createForbiddenResponse();

    if ( await fileService.delete(resultFile) && await fileManager.delete(resultFile) )
        return Responses.createSuccessResponse();
    else
        return Responses.createServerErrorResponse();
}




const getFormSchema = yup.object().shape(
    {
        id: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer(),
    }
);
const getFormValidator = new FormValidator(getFormSchema);

export async function GET( request : NextRequest )
{   
    const {searchParams} = await request.nextUrl;
    const validatorResult = await getFormValidator.validate( Object.fromEntries( searchParams.entries() ) );
    if(! validatorResult.isOK )
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;
    const resultFileModel = await fileManager.getById(formData.id)

    if(! resultFileModel )
        return Responses.createNotFoundResponse("No file where found with the provided id.");

    const file = fileService.load(resultFileModel);
    if(!file)
        return Responses.createServerErrorResponse();
    else
        return Responses.createSuccessResponse(file);
}