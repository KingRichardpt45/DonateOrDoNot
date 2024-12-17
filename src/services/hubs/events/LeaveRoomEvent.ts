import { IHubEvent } from "../IHubEvent";
import { NotificationHubRoomId } from "../notificationHub/NotificationHubRoomId";

export class LeaveRoomEvent implements IHubEvent<NotificationHubRoomId>
{
    readonly name: string;
    readonly data: NotificationHubRoomId;

    constructor(roomId:NotificationHubRoomId)
    {
        this.name = LeaveRoomEvent.name
        this.data = roomId;
    }

}