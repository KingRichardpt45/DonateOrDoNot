// Assuming each session object includes an 'expires' property.
import {Session} from "@/services/session/Session";
import {User} from "@/models/User";
import {ISessionUserCacheService} from "./ISessionCacheService";
import {Mutex} from "async-mutex";
import {RepositoryAsync} from "@/core/repository/RepositoryAsync";
import {Constrain} from "@/core/repository/Constrain";
import {IncludeNavigation} from "@/core/repository/IncludeNavigation";
import {Operator} from "@/core/repository/Operator";

/**
 * This class manages expired session user cache.
 */
export class LocalSessionUserCacheService implements ISessionUserCacheService {

    private readonly cache: Map<number, { user: User, session: Session }> = new Map();
    private readonly mutex = new Mutex();
    private readonly userRepository: RepositoryAsync<User>;
    private readonly delay: number;

    /**
     * Initializes a new instance of the LocalSessionUserCacheService.
     * Starts a periodic cleanup process to remove expired sessions from the cache.
     *
     * @param cleanUpInterval - The interval (in milliseconds) at which expired sessions are cleaned up.
     * @param delay - An additional delay (in minutes) to account for before marking a session as expired.
     * @param userRepository - The repository for retrieving user data based on session details.
     */
    constructor(cleanUpInterval: number, delay: number, userRepository: RepositoryAsync<User>) 
    {
        this.userRepository = userRepository;
        this.delay = delay
        setInterval(() => this.cleanupExpiredSessions(), cleanUpInterval);
    }

    /**
     * Stores a user in the cache associated with the given session.
     *
     * @param session - The session object containing user ID and expiration details.
     * @throws If the user corresponding to the session's user ID does not exist.
     */
    async store(session: Session): Promise<void> 
    {
        await this.mutex.runExclusive( () => { this.storeAux(session); return; } );
    }

    private async storeAux(session: Session): Promise<User>
    {   
        const user = await this.userRepository.getFirstByCondition(
            [new Constrain("id", Operator.EQUALS, session.userId)],
            (user) => [new IncludeNavigation(user.address, 0),new IncludeNavigation(user.profileImage, 0)],
            [], 0, 0
        );

        if (!user)
            throw new Error("Trying to store user but the provided id does not exist.")
        else
            this.cache.set(session.userId, {user, session});

        return user;
    }

    /**
     * Retrieves the user associated with the given session from the cache.
     *
     * @param session - The session object to look up in the cache.
     * @returns The user object if found, or `null` if no matching session exists in the cache.
     */
    async retrieve(session: Session): Promise<User | null> 
    {
        return await this.mutex.runExclusive( async ()  => 
            {   
                const now = new Date();
                let user = this.cache.get(session.userId)?.user;
        
                if( session.expires >= now && user == undefined )
                    user = await this.storeAux(session) as User | undefined;
                 
                return user !== undefined ? user : null;
            }
        );
    }

    /**
     * Removes the user associated with the given session from the cache.
     *
     * @param session - The session object to remove from the cache.
     */
    async remove(session: Session): Promise<void> 
    {
        await this.mutex.runExclusive(() => 
            {
                this.cache.delete(session.userId);
            }
        );
    }

    /**
     * Cleans up expired sessions from the cache. A session is considered expired if its expiration time,
     * plus the additional delay, is less than or equal to the current time.
     */
    private async cleanupExpiredSessions(): Promise<void> 
    {
        await this.mutex.runExclusive(() =>
            {
                const now = new Date();
                for (const [userId, value] of this.cache) {
                    const date = new Date(value.session.expires);
                    date.setMinutes(date.getMinutes() + this.delay)

                    if (date <= now) {
                        this.cache.delete(userId);
                    }
                }
            }
        );
    }
}
