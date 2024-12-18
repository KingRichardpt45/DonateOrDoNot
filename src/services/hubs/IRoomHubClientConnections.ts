import {EvenHandler, EventListener} from "./IHub";
import {IHubClientConnection} from "./IHubClientConnection";
import {IHubRoomId} from "./IHubRoomId";

export interface IRoomHubClientConnection extends IHubClientConnection
{
    addEventListenerToRoom( roomId:IHubRoomId<unknown>, event:string, handler:EvenHandler ) : EventListener
        
    removeEventListenerFromRoom(roomId:IHubRoomId<unknown>,  event:string, listener:EventListener ) : void

    clearEventListenersOfRoom(roomId:IHubRoomId<unknown>, event:string ) : void
}