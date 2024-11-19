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
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";

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
    
    // const result = await fileManager.
    // if(result.isOK)
    // {
    //     saveFile(file , await (formData.get("file") as File).arrayBuffer() ) ;

    //     return NextResponse.json({},{status:200,statusText:"File uploaded with success."});
    // }
    // else
    //     NextResponse.json({ errors: result.errors },{status:422,statusText:"Invalid file."});
}