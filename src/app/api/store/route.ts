import { NextRequest, NextResponse } from "next/server";
import { StoreItemManager } from "@/core/managers/StoreItemManager";
import * as yup from 'yup';
import { StoreItem } from "@/models/StoreItem";
import { FormValidator } from "@/core/utils/FormValidator";
import { DonorManager } from "@/core/managers/DonorManager";
import { FileManager } from "@/core/managers/FileManager"; 
import { File as ModelFile} from "@/models/File";
import fs from "node:fs/promises";
import { FileTypes } from "@/models/types/FileTypes";
import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";

const storeItemManager = new StoreItemManager();
const donorManager = new DonorManager();
const fileManager = new FileManager();
const savePath = "./public/documents/";
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");

const putFormSchema = yup.object().shape(
    {
        cost: yup.number().required().integer().positive().nonNullable(),
        description: yup.string().lowercase().trim().required().nonNullable().min(1).max(200),
        name: yup.string().lowercase().trim().required().nonNullable().min(1).max(100),
        imageFile: yup.mixed().required() 
        .test('fileSize', 'The file is too large', (value) => {
          if (value && (value as File).size ) 
            return (value as File).size <= 50 * 1024 * 1024;
          
          return false;
        })
        .test('fileType', 'Unsupported file type', (value) => {
          if (value && (value as File).type) 
            return ['image/jpeg', 'image/png'].includes((value as File).type);
          
          return false;
        })
    }
);
const putFormValidator = new FormValidator(putFormSchema);

export async function PUT( request:NextRequest )
{
    if( ! await authorizationService.hasRole(UserRoleTypes.Admin) )
        return NextResponse.json({error:"Not authorized to do this operation."},{status:401,statusText:"Unauthorized."})

    const bodyData = await request.formData();
    const validatorResult = await putFormValidator.validate( Object.fromEntries( bodyData.entries() ) );

    if(!validatorResult.isOK)
        return NextResponse.json({errors:validatorResult.errors},{status:422,statusText:"Form fields error."});

    const formData = validatorResult.value!
    const uploadedFile = formData.imageFile as File;
    const fileToCreate = new ModelFile();
    fileToCreate.original_name = uploadedFile.name;
    fileToCreate.file_path = savePath;
    fileToCreate.file_suffix = uploadedFile.type;
    fileToCreate.file_type = FileTypes.Image;
    fileToCreate.timestamp = new Date();
    fileToCreate.campaign_id = null;
    fileToCreate.user_id = null;
    const fileResult = await fileManager.createWithValidation(fileToCreate);
    
    if(!fileResult.isOK)
        return NextResponse.json({errors:fileResult.errors},{status:422,statusText:"Form fields error."});

    await saveFile(fileResult.value!,await uploadedFile.arrayBuffer());

    const stoItemToCreate = new StoreItem();
    stoItemToCreate.name = formData.name;
    stoItemToCreate.description = formData.description;
    stoItemToCreate.cost = formData.cost;
    stoItemToCreate.image_id = fileResult.value!.id;
    const createdStoreItem = await storeItemManager.create(stoItemToCreate);

    return NextResponse.json({item:createdStoreItem},{status:200,statusText:"Success."})
}

async function saveFile(file:ModelFile,fileData: ArrayBuffer)
{
    const arrayBuffer = fileData
    const buffer = new Uint8Array(arrayBuffer);

    await fs.writeFile(`${savePath}${file.id}`, buffer);
}





const deleteFormSchema = yup.object().shape(
    {
        store_item_id: yup.number().required().integer().positive().nonNullable()
    }
);
const deleteFormValidator = new FormValidator(deleteFormSchema);

export async function DELETE( request:NextRequest )
{
    if( ! await authorizationService.hasRole(UserRoleTypes.Admin) )
        return NextResponse.json({error:"Not authorized to do this operation."},{status:401,statusText:"Unauthorized."})

    const { searchParams } = request.nextUrl;
    const validatorResult = await deleteFormValidator.validate( Object.fromEntries(searchParams.entries()) );

    if(!validatorResult.isOK)
        return NextResponse.json({errors:validatorResult.errors},{status:422,statusText:"Form fields error."});
    
    const formData = validatorResult.value!;
    
    if ( await storeItemManager.deleteById(formData.store_item_id) )
        return NextResponse.json({},{status:200,statusText:"Success"});
    else
        return NextResponse.json({errors:"No item was found with the provided id."},{status:404,statusText:"Item not found."});

}




const searchFormSchema = yup.object().shape(
    {
        query: yup.string().lowercase().trim().required().nonNullable().min(1),
        page: yup.number().required().integer().positive().nonNullable(),
        pageSize: yup.number().required().integer().positive().nonNullable(),
    }
);
const searchFormValidator = new FormValidator(searchFormSchema);

export async function GET( request:NextRequest )
{
    const { searchParams } = request.nextUrl;
    const validatorResult = await searchFormValidator.validate( Object.fromEntries(searchParams.entries()) );

    if(!validatorResult.isOK)
        return NextResponse.json({errors:validatorResult.errors},{status:422,statusText:"Form fields error."});

    const formData = validatorResult.value!;
    const result = await storeItemManager.search(formData.query,formData.page,formData.pageSize);

    if(result.isOK)
        return NextResponse.json({items:result.value},{status:200,statusText:"Success"});
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
    if( ! await authorizationService.hasRole(UserRoleTypes.Donor) )
        return NextResponse.json({error:"Not authorized to do this operation."},{status:401,statusText:"Unauthorized."})

    const bodyData = await request.formData();
    const validationResult = await byFormValidator.validate( Object.fromEntries( bodyData.entries() ) );

    if(!validationResult.isOK)
        return NextResponse.json({errors:validationResult.errors},{status:422,statusText:"Form fields error."});

    const formData = validationResult.value!;
    const result = await donorManager.byStoreItem(formData.donor_id,formData.store_item_id,);

    if(result.isOK)
        return NextResponse.json({items:result.value},{status:200,statusText:"Success"});
}
