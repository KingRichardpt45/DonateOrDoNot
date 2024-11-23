import { NextRequest } from "next/server";
import { FormValidator } from "@/core/utils/FormValidator";
import { DonorManager } from "@/core/managers/DonorManager";
import { FileManager } from "@/core/managers/FileManager"; 
import * as yup from 'yup';
import { FileTypes } from "@/models/types/FileTypes";
import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { BadgeManager } from "@/core/managers/BadgeManager";
import { BadgeTypes } from "@/models/types/BadgeTypes";
import { Badge } from "@/models/Badge";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { FileService } from "@/services/FIleService";
import { Responses } from "@/core/utils/Responses";
import { YupUtils } from "@/core/utils/YupUtils";
import { FormError } from "@/core/utils/operation_result/FormError";
import { Constrain } from "@/core/repository/Constrain";
import { Operator } from "@/core/repository/Operator";

const badgeManager = new BadgeManager();
const donorManager = new DonorManager();
const fileManager = new FileManager();
const savePath = "./public/documents/";
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const fileService = Services.getInstance().get<FileService>("FileService");

const putFormSchema = yup.object().shape(
    {
        name: yup.string().trim().required().nonNullable().min(1).max(100),
        description: yup.string().trim().required().nonNullable().min(1).max(200),
        type: yup.number().required().integer().positive().nonNullable().min(0).max( Object.keys(BadgeTypes).length /2 - 1),
        unit: yup.string().trim().required().nullable(),
        value: yup.number().required().integer().positive().nullable(),
        imageFile: fileService.filesSchema
    }
);
const putFormValidator = new FormValidator(putFormSchema);

export async function PUT( request:NextRequest )
{   
    const user = await userProvider.getUser();
    if( ! user )
        return Responses.createUnauthorizedResponse();
    else if( user.type != UserRoleTypes.Admin)
        return Responses.createForbiddenResponse();

    const bodyData = await request.formData();
    const validatorResult = await putFormValidator.validate( Object.fromEntries( bodyData.entries() ) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!
    const uploadedFile = formData.imageFile as File;
    const fileResult = await fileManager.create(uploadedFile.name,fileService.savePath,uploadedFile.type,FileTypes.Image,uploadedFile.size,user.id!);
    
    if(!fileResult.isOK)
        return Responses.createValidationErrorResponse(fileResult.errors);

    if ( !await fileService.save(fileResult.value!,uploadedFile) )
        return Responses.createServerErrorResponse();

    const createdBadge = await badgeManager.create(formData.name,formData.description,formData.type,formData.unit,formData.value,fileResult.value!.id!);

    return Responses.createSuccessResponse(createdBadge);
}




const deleteFormSchema = yup.object().shape(
    {
        badge_id: yup.number().transform(YupUtils.convertToNumber).required().integer().positive().nonNullable()
    }
);
const deleteFormValidator = new FormValidator(deleteFormSchema);

export async function DELETE( request:NextRequest )
{
    if( ! await authorizationService.hasRoles(UserRoleTypes.Admin) )
        return Responses.createForbiddenResponse();

    const { searchParams } = request.nextUrl;
    const validatorResult = await deleteFormValidator.validate( Object.fromEntries(searchParams.entries()) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);
    
    const formData = validatorResult.value!;
    
    if ( await badgeManager.deleteById(formData.badge_id) )
        return Responses.createSuccessResponse();
    else
        return Responses.createNotFoundResponse();
}




const unlockFormSchema = yup.object().shape(
    {
        badge_id: yup.number().required().integer().positive().nonNullable(),
        donor_id: yup.number().required().integer().positive().nonNullable()
    }
);
const unlockFormValidator = new FormValidator(unlockFormSchema);

export async function POST( request:NextRequest )
{
    if( ! await authorizationService.hasRoles(UserRoleTypes.Donor) )
        return Responses.createForbiddenResponse();

    const formBody =  await request.formData();
    const validatorResult = await unlockFormValidator.validate( Object.fromEntries(formBody.entries()) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);
    
    const formData = validatorResult.value!;
    const unlockResult = await donorManager.unlockBadge(formData.donor_id,formData.badge_id);

    if ( !unlockResult.isOK )
        return Responses.createValidationErrorResponse(unlockResult.errors);

    return Responses.createSuccessResponse();
}

const updateFormSchema = yup.object().shape(
    {
        id: yup.number().required().nonNullable().positive().integer(),
        name: yup.string().trim().nonNullable().min(1).max(100),
        description: yup.string().trim().nonNullable().min(1).max(200),
        type: yup.number().integer().positive().nonNullable().min(0).max( Object.keys(BadgeTypes).length /2 - 1),
        unit: yup.string().trim().nullable(),
        value: yup.number().integer().positive().nullable(),
        imageFile: fileService.filesSchema
    }
);
const updateFormValidator = new FormValidator(updateFormSchema);

export async function PATCH( request:NextRequest )
{
    const user =  await userProvider.getUser();
    if( user == null || (user.type != UserRoleTypes.Admin && user.type != UserRoleTypes.CampaignManager) ) 
        return Responses.createForbiddenResponse();

    const formBody = await request.formData();
    const validatorResult = await updateFormValidator.validate( Object.fromEntries(formBody.entries()) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);
    
    const formData = validatorResult.value!;
    const badge = await badgeManager.getById(formData.id);

    if(badge == null)
        return Responses.createNotFoundResponse();

    if( (badge.type === BadgeTypes.FrequencyOfDonations || badge.type === BadgeTypes.TotalDonations || 
         badge.type === BadgeTypes.TotalValueDonated) && user.type != UserRoleTypes.Admin )
        return Responses.createForbiddenResponse();

    const updatedFields = [];
    for (const key in formData) 
    {
        if (key !== "id" ) 
        {
            badge[key] = formData[key as keyof typeof formData];
            updatedFields.push(key);
        }
    }

    if(updatedFields.length == 0)
        return Responses.createValidationErrorResponse(new FormError("id",["Id can not be updated.","Id can not be the only field in request."]));

  
    if( !await badgeManager.updateField(badge,updatedFields) )
        return Responses.createServerErrorResponse();

    return Responses.createSuccessResponse();
}

const getFormSchema = yup.object().shape(
    {
        query: yup.string().trim().required().nonNullable().min(1),
        page: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer().min(0),
        pageSize: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer().min(0),
        type: yup.number().transform(YupUtils.convertToNumber).integer().positive().min(0).max( Object.keys(BadgeTypes).length /2 -1 ).nullable(),
        id: yup.number().transform(YupUtils.convertToNumber).integer().positive().nullable().min(0)
    }
);
const getFormValidator = new FormValidator(getFormSchema);

export async function GET( request:NextRequest )
{
    const {searchParams} = await request.nextUrl;
    const validatorResult = await getFormValidator.validate( Object.fromEntries(searchParams.entries()) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;

    const constrains = []
    if(formData.type)
        constrains.push(new Constrain("type",Operator.EQUALS,formData.type));

    if (formData.id )
        constrains.push(new Constrain("user_id",Operator.EQUALS,formData.id));

    const result = await badgeManager.searchWithConstrains(formData.query,constrains,formData.page,formData.pageSize);
    
    if(!result.isOK)
        return Responses.createNotFoundResponse();

    return Responses.createSuccessResponse(result.value);
}