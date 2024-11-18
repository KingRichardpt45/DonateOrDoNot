import { User } from "@/models/User";
import { Session } from "@/services/session/Session";
import { GetServerSidePropsContext } from "next";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

/**
 * Represents a provider that fetches a user based on a given session.
 */
export interface IUserProvider 
{
    
    /**
     * Fetches the user associated with the session.
     * @returns {User | null} The user object associated with the provided session or null if the session hold no user.
     */
    getUser(): Promise<User | null> 

}
