import { FileManager } from "@/core/managers/FileManager";
import { FormObjectValidator } from "@/core/utils/FormObjectValidator";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { NextRequest, NextResponse } from "next/server";

const fileManager = new FileManager();
const formValidator = new FormObjectValidator("id");

export async function POST( request : NextRequest )
{
    const formData = await request.formData();

    const errors = formValidator.validate(formData);
    if( errors.length > 0 )
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});
}