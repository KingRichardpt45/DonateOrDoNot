import {EvenHandler, EventListener} from "./IHub";
import {IHubConnectionId} from "./IHubConnectionId";
import {IHubEvent} from "./IHubEvent";
import {IHubRoomId} from "./IHubRoomId"
import {IHubServerConnection} from "./IHubServerConnection";

export interface IHubRoom 
{
    readonly id: IHubRoomId<unknown>;

    addConnection( connectionId: IHubServerConnection<unknown> ): void

    removeConnection(connectionId: IHubConnectionId<unknown> ): void

    getConnections(roomId: IHubRoomId<unknown>): IHubServerConnection<unknown>[]

    hasConnection(roomId: IHubConnectionId<unknown> ): boolean

    close() : void

    emitEvent( event:IHubEvent<unknown> ) : void

    addEventListener( event:string, handler:EvenHandler ) : EventListener
        
    removeEventListener( event:string, listener:EventListener ) : void

    clearEventListeners( event:string ) : void

    clearAllEventListeners() : void
}