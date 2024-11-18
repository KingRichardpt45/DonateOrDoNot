import "server-only"
import { IEncryption } from "@/core/Utils/Encryption/IEncryption";
import { cookies } from "next/headers";
import { Cookie } from "./Cookie";
import { Session } from "@/services/session/Session"
import { ISessionUserCacheService } from "./SessionCahingService/ISessionCacheService";

/**
 * Service for managing user sessions, handling session creation, verification, and deletion.
 */
export class SessionService
{

    private readonly encryptor: IEncryption;
    private readonly templateCookie : Cookie;
    private readonly cachingService : ISessionUserCacheService;
    
    /**
     * Creates an instance of the SessionService.
     * @param encryptor The encryption utility used to encrypt/decrypt session data.
     * @param cookieTemplate An optional template for cookie properties. If not provided, defaults to a standard session cookie.
     */
    constructor( encryptor:IEncryption, cachingService:ISessionUserCacheService, cookieTemplate?:Cookie)
    {
        this.encryptor = encryptor;
        this.cachingService = cachingService;

        if (cookieTemplate) {
            this.templateCookie = cookieTemplate;
        } 
        else 
        {
            this.templateCookie = new Cookie("session", 86400000, 
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    path: "/",
                });
        }
    }
    
    /**
     * Creates a new session for a user by encrypting the user ID and session expiration time.
     * @param userId The ID of the user for whom the session is being created.
     */
    public async create( userId:number ) : Promise<Session>
    {
        const expires = new Date( Date.now() +  this.templateCookie.duration );
        const session = new Session(userId, expires);
        const encryptedSession : string = await this.encryptor.encrypt( { userId:session.userId, expires:session.expires } );

        (await cookies()).set(this.templateCookie.name, encryptedSession, {...this.templateCookie.options, expires});

        this.cachingService.store(session);

        return session;
    }

    /**
     * Verifies the session by decrypting the session cookie and extracting the user ID.
     * @returns The user ID if the session is valid, or null if the session is invalid or expired.
     */
    public async verify() : Promise<Session | null>
    {
        const cookie = (await cookies()).get(this.templateCookie.name)?.value;

        if (!cookie) 
            return null;

        try 
        {
            const session = (await this.encryptor.decrypt( cookie )) as { userId:number, expires:Date };
            return session? new Session( session.userId, new Date(session.expires) ) : null;
        }
        catch (error)
        {
            return null;
        }
    }

    /**
     * Deletes the session by clearing the session cookie.
     */
    public async delete() : Promise<void>
    {   
        let session = await this.verify();

        if(session)
        {
            this.cachingService.remove(session);

            (await cookies()).delete(this.templateCookie);
        }
    }
}