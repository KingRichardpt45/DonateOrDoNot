import { NextRequest } from "next/server";
import { StoreItemManager } from "@/core/managers/StoreItemManager";
import * as yup from 'yup';
import { StoreItem } from "@/models/StoreItem";
import { FormValidator } from "@/core/utils/FormValidator";
import { DonorManager } from "@/core/managers/DonorManager";
import { FileManager } from "@/core/managers/FileManager"; 
import { File as ModelFile} from "@/models/File";
import { FileTypes } from "@/models/types/FileTypes";
import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { FileService } from "@/services/FIleService";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { Responses } from "@/core/utils/Responses";
import { YupUtils } from "@/core/utils/YupUtils";

const storeItemManager = new StoreItemManager();
const donorManager = new DonorManager();
const fileManager = new FileManager();
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const fileService = Services.getInstance().get<FileService>("FileService");
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

const putFormSchema = yup.object().shape(
    {
        cost: yup.number().required().positive().nonNullable(),
        description: yup.string().lowercase().trim().required().nonNullable().min(1).max(200),
        name: yup.string().lowercase().trim().required().nonNullable().min(1).max(100),
        imageFile: fileService.filesSchema,
    }
);
const putFormValidator = new FormValidator(putFormSchema);

export async function PUT( request:NextRequest )
{
    const user = await userProvider.getUser();
    if( ! user || user.type != UserRoleTypes.Admin )
        return Responses.createUnauthorizedResponse();

    const bodyData = await request.formData();
    const validatorResult = await putFormValidator.validate( Object.fromEntries( bodyData.entries() ) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!
    const uploadedFile : File = formData.imageFile as File;
    const fileResult = await fileManager.create(uploadedFile.name,fileService.savePath,uploadedFile.type,FileTypes.Image,user.id!);
    if(!fileResult.isOK)
        return Responses.createValidationErrorResponse(fileResult.errors);

    if (!await fileService.save(fileResult.value!,uploadedFile))
    {
        await fileManager.delete(fileResult.value!);
        return Responses.createValidationErrorResponse(fileResult.errors);
    }

    const createdStoreItem = await storeItemManager.create(formData.name,formData.description,formData.cost,fileResult.value!.id!);

    return Responses.createSuccessResponse(createdStoreItem);
}




const deleteFormSchema = yup.object().shape(
    {
        store_item_id: yup.number().required().integer().positive().nonNullable()
    }
);
const deleteFormValidator = new FormValidator(deleteFormSchema);

export async function DELETE( request:NextRequest )
{
    if( ! await authorizationService.hasRoles(UserRoleTypes.Admin) )
        return Responses.createUnauthorizedResponse();

    const { searchParams } = request.nextUrl;
    const validatorResult = await deleteFormValidator.validate( Object.fromEntries(searchParams.entries()) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);
    
    const formData = validatorResult.value!;
    
    if ( !await storeItemManager.deleteById(formData.store_item_id) )
        return Responses.createNotFoundResponse("No item was found with the provided id.");
    else
        return Responses.createSuccessResponse();
}




const searchFormSchema = yup.object().shape(
    {
        query: yup.string().lowercase().trim().required().nonNullable().min(1),
        page: yup.number().transform(YupUtils.convertToNumber).required().integer().positive().nonNullable(),
        pageSize: yup.number().transform(YupUtils.convertToNumber).required().integer().positive().nonNullable(),
    }
);
const searchFormValidator = new FormValidator(searchFormSchema);

export async function GET( request:NextRequest )
{
    const { searchParams } = request.nextUrl;
    const validatorResult = await searchFormValidator.validate( Object.fromEntries(searchParams.entries()) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;
    const result = await storeItemManager.search(formData.query,formData.page,formData.pageSize);

    if(result.isOK)
        return Responses.createSuccessResponse(result.value);
    else
        return Responses.createNotFoundResponse("No item where found with the provided search.");
}




const byFormSchema = yup.object().shape(
    {
        store_item_id: yup.number().required().integer().positive().nonNullable(),
        donor_id: yup.number().required().integer().positive().nonNullable(),
    }
);
const byFormValidator = new FormValidator(byFormSchema);

export async function POST( request:NextRequest )
{
    if( ! await authorizationService.hasRoles(UserRoleTypes.Donor) )
        return Responses.createUnauthorizedResponse();

    const bodyData = await request.formData();
    const validationResult = await byFormValidator.validate( Object.fromEntries( bodyData.entries() ) );

    if(!validationResult.isOK)
        return Responses.createValidationErrorResponse(validationResult.errors);

    const formData = validationResult.value!;
    const result = await donorManager.byStoreItem(formData.donor_id,formData.store_item_id,);

    if(result.isOK)
        return Responses.createSuccessResponse();
    else
        return Responses.createValidationErrorResponse(result.errors);
}




const updateFormSchema = yup.object().shape(
    {
        id: yup.number().required().integer().positive().nonNullable(),
        cost: yup.number().integer().positive().nonNullable(),
        description: yup.string().lowercase().trim().nonNullable().min(1).max(200),
        name: yup.string().lowercase().trim().nonNullable().min(1).max(100),
        imageFile: fileService.filesSchema
    }
);
const updateFormValidator = new FormValidator(updateFormSchema);

export async function PATCH( request:NextRequest )
{
    const user = await userProvider.getUser();
    if( ! user || user.type != UserRoleTypes.Admin )
        return Responses.createUnauthorizedResponse();

    const { searchParams } = request.nextUrl;
    const validatorResult = await updateFormValidator.validate( Object.fromEntries(searchParams.entries()) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);
    
    const formData = validatorResult.value!;
    const storeItem = await storeItemManager.getById(formData.id);
    if(storeItem == null)
        return Responses.createValidationErrorResponse(["Id not fount."],"Badge not found.");

    const updatedFields = [];
    for (const key in formData) 
    {
        if (key == "imageFile" ) 
        {   
            const oldFile = await fileManager.getById(storeItem.image_id!) as ModelFile;
            const uploadedFile = formData.imageFile as File;
            const fileResult = await fileManager.create(uploadedFile.name,fileService.savePath,uploadedFile.type,FileTypes.Image,user.id!);
            if(!fileResult.isOK)
                return Responses.createValidationErrorResponse(fileResult.errors);
            fileService.update(oldFile,fileResult.value!,uploadedFile)
        }
        else
        {
            storeItem[key] = formData[key as keyof typeof formData];
            updatedFields.push(key);
        }
    }

    if(updatedFields.length == 0)
        return Responses.createValidationErrorResponse(["Id can not be updated.","No other fields to update."],"No fields for updated.")

    const updated = await storeItemManager.updateField(storeItem,updatedFields);

    if(updated)
        return Responses.createSuccessResponse();
    else
        return Responses.createServerErrorResponse();
}