/**
 * Enum representing the status of a campaign.
 *
 * @enum {number}
 */
export enum CampaignStatus {
    /**
     * Status when the campaign is in analysis.
     */
    InAnalysis = 0,

    /**
     * Status when the campaign is approved.
     */
    Approved = 1,

    /**
     * Status when the campaign is reproved.
     */
    Reproved = 2,

    /**
     * Status when the campaign is active.
     */
    Active = 3,

    /**
     * Status when the campaign is closed.
     */
    Closed = 4,
}