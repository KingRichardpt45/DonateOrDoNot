/**
 * Enum representing the type of notification.
 *
 * @enum {number}
 */
export enum NotificationTypes 
{
    campaign_badges_changed = 0,
    campaign_files_changed = 1,
    campaign_status_changed = 2,
    campaign_new_donation_level = 3,
    campaign_validation = 4,
    account_status_changed = 5,
    account_verified = 6,
    account_not_verified = 7,
    new_badge_unlocked = 8,
    new_item_acquired = 9,
    new_position_ranking_donations = 10,
    new_position_ranking_frequency = 11,
    new_position_ranking_most_value = 12,
}