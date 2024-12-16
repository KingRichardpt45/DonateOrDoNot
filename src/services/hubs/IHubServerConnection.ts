import { EvenHandler, EventListener } from "./IHub";
import { IHubConnectionId } from "./IHubConnectionId";
import { IHubEvent } from "./IHubEvent";
import { IHubRoomId } from "./IHubRoomId";

export interface IHubServerConnection<Data>
{
    readonly id : IHubConnectionId<any>;

    readonly data: Data;
}