import { IHubConnectionId } from "../IHubConnectionId";
import { IHubEvent } from "../IHubEvent";
import { NotificationHubRoomId } from "../notificationHub/NotificationHubRoomId";
import { NotificationHubConnectionId } from "../notificationHub/NotificationHutConnectionId";

type Data = { originalEvent:IHubEvent<unknown>,toRom:NotificationHubRoomId | null, toConnection:NotificationHubConnectionId | null }

export class RetransmissionEvent implements IHubEvent<Data>
{
    readonly name: string;
    readonly data: Data;

    constructor( event:Data )
    {
        if(!event.toRom && !event.toConnection)
            throw Error("RetransmissionEvent needs to have a destination. toRom or toConnection need to be defined.");

        this.name = RetransmissionEvent.name
        this.data = event;
    }
}