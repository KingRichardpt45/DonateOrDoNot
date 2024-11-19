import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { File as ModelFile } from "@/models/File";
import { FileManager } from "@/core/managers/FileManager";
import { FormObjectValidator } from "@/core/utils/FormObjectValidator";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { FormError } from "@/core/managers/FormError";

const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const fileManager = new FileManager();
const formValidator = new FormObjectValidator("fileId","userId");
const savePath = "./public/documents/";


export async function POST( request : NextRequest )
{   
    const user = await userProvider.getUser();
    if( !user )
        return NextResponse.redirect( new URL( "/signin", request.url) );

    const formData = await request.formData();
    const errors = formValidator.validate(formData);
    if(errors.length > 0)
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});

    if( user.id != formData.get("userId") )
        return NextResponse.redirect( new URL( "/notAuthorized", request.url) );
    
    const result = await fileManager.getById( formData.get("fileId")!.valueOf() as number );

    if(result == null)
        return NextResponse.json({ errors: [new FormError("fileId",["No id matches the provided fileId."])]}, {status: 422, statusText: "Invalid form fields."});

    return deleteFile(result);   
}

async function deleteFile(file:ModelFile)
{
    try {
        // Resolve the file path to delete
        const filePath = `${savePath}${file.id}`;
        
        // Delete the file from the filesystem
        await fs.unlink(filePath);

        await fileManager.deleteById( file.id! );

        return NextResponse.json(
            { message: "File deleted successfully." },
            { status: 200, statusText: "Success" }
        );
    } 
    catch (error) 
    {
        console.error("Error deleting file:", error);

        return NextResponse.json(
            { errors: ["An error occurred while deleting the file."] },
            { status: 500, statusText: "Internal Server Error" }
        );
    }
}