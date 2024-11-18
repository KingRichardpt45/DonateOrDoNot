/**
 * Enum representing the status of a campaign.
 *
 * @enum {number}
 */
export enum CampaignStatus {
    /**
     * Status when the campaign status is unknown.
     */
    Unknown = 0,

    /**
     * Status when the campaign is in analysis.
     */
    InAnalysis = 1,

    /**
     * Status when the campaign is approved.
     */
    Approved = 2,

    /**
     * Status when the campaign is reproved.
     */
    Reproved = 3,

    /**
     * Status when the campaign is active.
     */
    Active = 4,

    /**
     * Status when the campaign is closed.
     */
    Closed = 5,
}