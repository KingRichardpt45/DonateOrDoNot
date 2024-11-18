import { UserManager } from "@/core/Managers/UserManager";
import { FormObjectValidator } from "@/core/Utils/FormObjectValidator";
import { User } from "@/models/User";
import { Services } from "@/services/Services";
import { ISessionUserCacheService } from "@/services/session/SessionCahingService/ISessionCacheService";
import { SessionService } from "@/services/session/SessionService";
import { NextRequest, NextResponse } from "next/server";

const sessionService = Services.getInstance().get<SessionService>("SessionService")
const userManager = new UserManager();
const validatorSingInForm = new FormObjectValidator( "email", "password" );

export async function POST( request: NextRequest ) 
{
    const session = await sessionService.verify() 

    if( session != null && session.expires >= new Date() )
    {
        return NextResponse.json({},{status:400,statusText:"Already have a valid session."})
    }
    else
    {
        const formData = await request.formData();
        const errors = validatorSingInForm.validate(formData);

        if(errors.length > 0)
            return NextResponse.json({errors},{status:422,statusText:"Invalid form fields."})

        //console.log(formData)

        let result = await userManager.singIn(
            formData.get("email")!.toString().trim() ,
            formData.get("password")!.toString().trim()
        )

        if( !result.isOK )
            return NextResponse.json({ errors: result.errors },{status:401,statusText:"Invalid credentials."})

        const session = await sessionService.create( result.value!.id as number );

        return NextResponse.json({},{status:200})
    }
}