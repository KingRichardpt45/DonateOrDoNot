import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Represents a user session.
 * This class stores the user's ID and the expiration date of the session.
 */
export class Session {
    /**
     * The unique identifier for the user associated with this session.
     */
    readonly userId: number;

    /**
     * The expiration date of the session.
     */
    readonly expires: Date;

    /**
     * Creates a new instance of the Session class.
     * @param userId - The unique identifier for the user.
     * @param expires - The expiration date of the session.
     */
    constructor(userId: number, expires: Date) {
        this.userId = userId;
        this.expires = expires;
    }

    static setInHeader( res:NextResponse, session:Session) : void
    {
        res.headers.set('parsedSession', JSON.stringify(session)); // Pass the session info via headers
    }

    static getFromNextRequest( req:NextRequest ) : Session | null
    {
        const sessionHeader = req.headers.get("parsedSession");
        const session =  sessionHeader? JSON.parse(sessionHeader) as Session : null ;

        return session;
    }

    static getFromHeader( headers:ReadonlyHeaders ) : Session | null
    {
        const sessionHeader = headers.get("parsedSession");
        const session =  sessionHeader? JSON.parse(sessionHeader) as Session : null ;

        return session;
    }

    /**
     * Checks if this session is equal to another session.
     * Two sessions are considered equal if their `userId` and `expires` properties are identical.
     * 
     * @param other - The session to compare with the current instance.
     * @returns `true` if the sessions are equal, otherwise `false`.
     */
    equals(other: Session): boolean 
    {   
        if (!other) return false;

        if( !(other instanceof Session) ) return false;
        
        return this.userId === other.userId && this.expires.getTime() === other.expires.getTime();
    }
}