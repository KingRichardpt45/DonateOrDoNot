/**
 * Enum representing the possible statuses of a user account.
 */
export enum AccountStatus 
{    
    /** The account is active and fully functional. */
    Active = 1,

    /** The account is suspended and cannot be used. */
    Suspended = 2,

    /** The account is deactivated by the user or system. */
    Deactivated = 3,

    /** The account is pending activation by the user or system. */
    Pending = 4,
}