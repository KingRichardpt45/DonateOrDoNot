import { UserManager } from "@/core/managers/UserManager";
import { User } from "@/models/User";
import { Services } from "@/services/Services";
import { ISessionUserCacheService } from "@/services/session/SessionCahingService/ISessionCacheService";
import { SessionService } from "@/services/session/SessionService";
import { NextRequest, NextResponse } from "next/server";

const sessionService = Services.getInstance().get<SessionService>("SessionService")
const userManager = new UserManager();

export async function POST( request: NextRequest ) 
{
    const session = await sessionService.verify() 
    if( session != null && session.expires >= new Date() )
    {
        let userId = session.userId;
        let user = await userManager.getById(userId);

        if(user == null)
        {
            console.error("Trying to singOut an account that has been deleted or never existed but has a session.")
            return NextResponse.json({},{status:500})
        }

        await sessionService.delete();

        return NextResponse.json({},{status:200})
    }
    else
    {
        return NextResponse.json({},{status:400,statusText:"User does not have a valid session to singOut."})
    }
}