import "server-only"
import { User } from "@/models/User";
import { Session } from "../Session";
import { IUserProvider } from "./IUserProvider";
import { ISessionUserCacheService } from "../SessionCahingService/ISessionCacheService";
import { NextRequest } from "next/server";
import { GetServerSidePropsContext } from "next";
import { Services } from "../../Services";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { SessionService } from "../SessionService";

/**
 * Provides the user, including retrieving user information based on a session.
 */
export class UserProvider implements IUserProvider {

    /**
     * The caching service used to store and retrieve users associated with sessions.
     */
    private readonly sessionCacheService: ISessionUserCacheService;
    private readonly sessionService : SessionService;

    /**
     * Constructs a new UserProvider instance.
     * 
     * @param userCachingService The session-user cache service to be used by this provider.
     */
    constructor(sessionService:SessionService,userCachingService: ISessionUserCacheService) 
    {
        this.sessionCacheService = userCachingService;
        this.sessionService = sessionService;
    }

    async getUser(): Promise<User | null> 
    {
        const session = await this.sessionService.verify();

        console.log("userprovider", session);
        
        if(!session)
            return null;

        return await this.sessionCacheService.retrieve(session);
    }
}