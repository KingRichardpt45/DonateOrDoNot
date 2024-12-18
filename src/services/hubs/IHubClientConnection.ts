import {EvenHandler, EventListener} from "./IHub";
import {IHubConnectionId} from "./IHubConnectionId";
import {IHubEvent} from "./IHubEvent";
import {IHubRoomId} from "./IHubRoomId";

export interface IHubClientConnection
{
    getId() : IHubConnectionId<any>;

    addAfterConnectionHandler( handler:()=>void ): Promise<void>

    isConnected() : boolean;

    disconnect(): void;

    
    emitEvent(event: IHubEvent<unknown>): void;


    addEventListener( event:string, handler:EvenHandler ) : EventListener
    
    removeEventListener( event:string, listener:EventListener ) : void

    clearEventListeners( event:string ) : void

    clearAllEventListeners() : void
    
}