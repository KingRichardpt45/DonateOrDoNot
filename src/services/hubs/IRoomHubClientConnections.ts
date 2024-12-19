import {EvenHandler, EventListener} from "./IHub";
import {IHubClientConnection} from "./IHubClientConnection";
import {IHubRoomId} from "./IHubRoomId";

export interface IRoomHubClientConnection extends IHubClientConnection
{
    isInRoom(roomId: IHubRoomId<unknown> ): Promise<boolean>;

    getRooms(): Promise<Set<IHubRoomId<unknown>>>;

    joinRoom(roomId: IHubRoomId<unknown>): void;

    leaveRoom(roomId: IHubRoomId<unknown>): void;

    // emitEventToRoom( event:IHubEvent<unknown>, roomId: IHubRoomId<unknown> ) : void;

    // emitEventToRooms( event:IHubEvent<unknown>, roomIds: IHubRoomId<unknown>[], ) : void;

    // emitEventToAllRooms( event:IHubEvent<unknown>, roomIds: IHubRoomId<unknown>[], ) : void;

    // emitEventToAllExceptRooms( event:IHubEvent<unknown>, roomIds: IHubRoomId<unknown>[], ) : void;
}