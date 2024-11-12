/**
 * Enum representing the different types of users.
 *
 * This enum is used to differentiate between various roles or user types,
 * such as a `DONOR` or `CAMPAIGN_MANAGER`.
 */
export enum UserType {
    /** Represents a user who is a donor, contributing to campaigns. */
    Donor = 0,

    /** Represents a user who manages campaigns. */
    CampaignManager = 1,
}