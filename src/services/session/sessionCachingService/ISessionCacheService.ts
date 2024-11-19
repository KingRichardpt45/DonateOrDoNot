import {User} from "@/models/User";
import {Session} from "@/services/session/Session";

/**
 * Interface for a session-based user cache.
 */
export interface ISessionUserCacheService {
    /**
     * Stores a user in the cache associated with a session.
     * @param {Session} session - The session object representing the user's session.
     * @param {User} user - The user object to be stored in the cache.
     *
     * @returns {void} This method does not return anything.
     */
    store(session: Session): Promise<void>;

    /**
     * Retrieves the user associated with a given session from the cache.
     * @param {Session} session - The session object used to retrieve the associated user.
     * @returns {User} The user object stored in the cache for the given session.
     */
    retrieve(session: Session): Promise<User | null>;

    /**
     * Removes the user associated with the given session from the cache.
     * @param {Session} session - The session object used to remove the associated user.
     *
     * @returns {void} This method does not return anything.
     */
    remove(session: Session): Promise<void>;
}
