import {NotificationHubRoomId} from "./NotificationHubRoomId";

export class RoomIdGenerator
{
    static generateUserRoom(user_id:number): NotificationHubRoomId
    {
        return new NotificationHubRoomId(`User_${user_id}`);
    }

    static generateCampaignRoom(campaign_id:number): NotificationHubRoomId
    {
        return new NotificationHubRoomId(`Campaign_${campaign_id}`);
    }
}