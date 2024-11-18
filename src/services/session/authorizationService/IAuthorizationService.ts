import { UserRoleTypes } from "@/models/types/UserRoleTypes";
/**
 * Interface for authorization.
 */
export interface IAuthorizationService 
{
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
    hasRole( role: UserRoleTypes ): Promise<boolean> 
    
    /**
     * Verifies user authorization and redirects if unauthorized.
     * 
     * @param requiredRole - The required role for accessing a resource.
     * @param redirectTo - The path to redirect to if authorization fails.
     * @throws Redirects the user to the specified path if unauthorized.
     */
    authorizeRedirect( requiredRole: UserRoleTypes, redirectTo?: string): Promise<void> 
}