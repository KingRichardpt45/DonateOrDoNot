import "server-only"

import {UserRoleTypes} from "@/models/types/UserRoleTypes";

/**
 * Interface for authorization.
 */
export interface IAuthorizationService {
    /**
     * Checks if there is an active user session.
     *
     * @returns True if a user session exists, false otherwise.
     */
    hasSession(): Promise<boolean>

    /**
     * Checks if the current user has the specified role.
     *
     * @param role - The required user role.
     * @returns True if the user has the specified role, false otherwise.
     */
    hasRole(role: UserRoleTypes): Promise<boolean>
}