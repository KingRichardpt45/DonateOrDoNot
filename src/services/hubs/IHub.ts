import {IHubServerConnection} from "./IHubServerConnection"
import {IHubConnectionId} from "./IHubConnectionId"
import {IHubEvent} from "./IHubEvent"

export interface IHub
{   
    /**
     * Creates connection to hub.
     * @returns The connected NotificationHubClientConnection.
     */
    getConnectionLink(): string

    /**
     * Retrieves all active server connections.
     * @returns An array of IHubServerConnection<unknown>.
     */
    getConnections(): Promise<IHubServerConnection<unknown>[]> 

    /**
     * Retrieves all active connection IDs.
     * @returns An array of IHubConnectionId<unknown>.
     */
    getConnectionIds(): Promise<IHubConnectionId<unknown>[]> 


    /**
     * Emits an event to a specific connection.
     * @param event - The event to emit.
     * @param connectionId - The ID of the connection.
     */
    emitEventToConnection( event:IHubEvent<unknown>, connectionId:IHubConnectionId<unknown> ) : void

    /**
     * Emits an event to multiple connections.
     * @param event - The event to emit.
     * @param connectionIds - The IDs of the connections.
     */
    emitEventToConnections( event:IHubEvent<unknown> , ...connectionIds:IHubConnectionId<unknown>[]  ) : void


    /**
     * Broadcasts an event to all connections except specified ones.
     * @param event - The event to broadcast.
     * @param exceptConnectionIds - The IDs of the connections to exclude.
     */
    broadcastExcept( event:IHubEvent<unknown> , ...exceptConnectionIds:IHubConnectionId<unknown>[]  ) : void
    
    /**
     * Broadcasts an event to all connections.
     * @param event - The event to broadcast.
     */
    broadcast( event:IHubEvent<unknown> ) : void


    /**
     * Adds an event listener for a specific event.
     * @param event - The event to listen for.
     * @param handler - The handler for the event.
     * @returns The added EventListener.
     */
    addEventListener( event:string, handler:EvenHandler ) : EventListener

    /**
     * Removes a specific event listener.
     * @param event - The event to stop listening for.
     * @param listener - The listener to remove.
     */
    removeEventListener( event:string, listener:EventListener ) : void

    /**
     * Clears all listeners for a specific event.
     * @param event - The event to clear listeners for.
     */
    clearEventListeners( event:string ) : void

    /**
     * Clears all event listeners globally and in all rooms.
     */
    clearAllEventListeners() : void

    /**
     * Closes all connections, clears resources, and shuts down the hub.
     */
    close() : void 

}

export type EvenHandler = (event:IHubEvent<unknown>) => void 
export type EventListener = { id:number, handler:EvenHandler }