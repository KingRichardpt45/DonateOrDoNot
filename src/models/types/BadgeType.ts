/**
 * Enum representing different types of badges.
 */
export enum BadgeType {
    /**
     * Unknown badge.
     */
    Unknown = 0,

    /**
     * Badge for total number of donations.
     */
    TotalDonations = 1,

    /**
     * Badge for the total value donated.
     */
    TotalValueDonated = 2,

    /**
     * Badge for the frequency of donations.
     */
    FrequencyOfDonations = 3,

    /**
     * Badge for being a campaign helper.
     */
    CampaignHelper = 4,

    /**
     * Badge for being a campaign partner.
     */
    CampaignPartner = 5,

    /**
     * Badge for being part of the campaign family.
     */
    CampaignFamily = 6,
}