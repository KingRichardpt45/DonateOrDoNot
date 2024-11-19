import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { File as ModelFile } from "@/models/File";
import { FileManager } from "@/core/managers/FileManager";
import { FormObjectValidator } from "@/core/utils/FormObjectValidator";
import { FileTypes } from "@/models/types/FileTypes";
import {EnumUtils} from "@/core/utils/EnumUtils";

const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const fileManager = new FileManager();
const fileFormValidator = new FormObjectValidator("type","file","userId");
const savePath = "./public/documents/";

export async function POST( request : NextRequest )
{
    if( !await authorizationService.hasRole(UserRoleTypes.CampaignManager) )
        return NextResponse.json({},{status:401, statusText:"You are not authorized to upload files."})

    const formData = await request.formData();

    const errors = fileFormValidator.validate(formData);
    if( errors.length > 0 )
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});
    
    const type = EnumUtils.getEnumValue(FileTypes,formData.get("type") as string);
    if( type == null )
        return NextResponse.json({}, {status: 400, statusText: "Invalid type for file."} );

    const file = createFile(formData,type);
    const result = await fileManager.createWithValidation(file);

    if(result.isOK)
    {
        saveFile(file , await (formData.get("file") as File).arrayBuffer() ) ;

        return NextResponse.json({},{status:200,statusText:"File uploaded with success."});
    }
    else
        NextResponse.json({ errors: result.errors },{status:422,statusText:"Invalid file."});
}

function createFile( formData: FormData, type: number) : ModelFile
{
    const file = new ModelFile();
    const uploadedFile = formData.get("file") as File;
    file.original_name = uploadedFile.name;
    file.file_path = savePath;
    file.file_suffix = uploadedFile.type;
    file.file_type = type;
    file.timestamp = new Date();
    file.campaign_id = null;
    file.user_id = formData.get("userId")!.valueOf() as number;

    return file;
}

async function saveFile(file:ModelFile,fileData: ArrayBuffer)
{
    const arrayBuffer = fileData
    const buffer = new Uint8Array(arrayBuffer);

    await fs.writeFile(`${savePath}${file.id}`, buffer);
}