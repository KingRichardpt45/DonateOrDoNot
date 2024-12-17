import { IHubEvent } from "../IHubEvent";
import { NotificationHubRoomId } from "../notificationHub/NotificationHubRoomId";

export class JoinRoomEvent implements IHubEvent<NotificationHubRoomId>
{
    readonly name: string;
    readonly data: NotificationHubRoomId;

    constructor(roomId:NotificationHubRoomId)
    {
        this.name = JoinRoomEvent.name
        this.data = roomId;
    }
}