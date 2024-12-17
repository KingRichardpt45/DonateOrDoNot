import { DefaultEventsMap, Socket } from "socket.io";
import { IHubServerConnection } from "../IHubServerConnection";
import { IHubConnectionId } from "../IHubConnectionId";
import { NotificationHubConnectionId } from "./NotificationHutConnectionId";

export class NotificationServerHubConnection implements IHubServerConnection<Socket>
{
    readonly id: NotificationHubConnectionId;
    readonly data: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

    constructor(socket:Socket)
    {
        this.data = socket;
        this.id = new NotificationHubConnectionId(this.data.id);
    }
}