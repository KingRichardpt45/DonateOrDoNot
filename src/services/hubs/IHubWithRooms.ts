import { EvenHandler, EventListener, IHub } from "./IHub";
import { IHubConnectionId } from "./IHubConnectionId";
import { IHubEvent } from "./IHubEvent";
import { IHubRoom } from "./IHubRoom";
import { IHubRoomId } from "./IHubRoomId";
import { IHubServerConnection } from "./IHubServerConnection";

export interface IHubWithRooms extends IHub
{
    /**
     * Retrieves all rooms currently managed by the hub.
     * @returns An array of NotificationHubRoom.
     */
    getRooms() : Promise<IHubRoom[]>
    
    /**
     * Retrieves the IDs of all rooms.
     * @returns An array of NotificationHubRoomId.
     */
    getRoomIds() : Promise<IHubRoomId<any>[]>


    /**
     * Opens a new room with the specified ID.
     * @param roomId - The ID of the room to open.
     */
    openRoom( roomId:IHubRoomId<unknown> ) : Promise<IHubRoom>

    /**
     * Closes a room with the specified ID.
     * @param roomId - The ID of the room to close.
     */
    closeRoom( roomId:IHubRoomId<unknown> ) : Promise<void>


    /**
     * Adds a connection to a specific room.
     * @param connection - The connection to add.
     * @param roomId - The ID of the room to add the connection to.
     */
    addConnectionToRoom(connection: IHubServerConnection<unknown>, roomId: IHubRoomId<unknown>): Promise<void>

    /**
     * Removes a connection from a specific room.
     * @param connectionId - The ID of the connection to remove.
     * @param roomId - The ID of the room to remove the connection from.
     */
    removeConnectionFromRoom(connectionId: IHubConnectionId<unknown>, roomId: IHubRoomId<unknown>): Promise<void>

    /**
     * Retrieves connections within a specific room.
     * @param roomId - The ID of the room.
     * @returns An array of IHubServerConnection.
     */
    getConnectionsInRoom(roomId: IHubRoomId<any>): Promise<IHubServerConnection<unknown>[]>

    /**
     * Retrieves all rooms a connection is part of.
     * @param connectionId - The ID of the connection.
     * @returns An array of NotificationHubRoom.
     */
    getRoomsOfConnection(connectionId: IHubConnectionId<unknown>): Promise<IHubRoom[]>

    /**
     * Checks if a room exists by its ID.
     * @param roomId - The ID of the room.
     * @returns True if the room exists, false otherwise.
     */
    hasRoom(roomId: IHubRoomId<unknown>): Promise<boolean>

    
    /**
     * Emits an event to a specific room.
     * @param event - The event to emit.
     * @param roomId - The ID of the room.
     */
    emitEventToRoom( event:IHubEvent<unknown>, roomId:IHubRoomId<unknown> ) : Promise<void>

    /**
     * Emits an event to multiple rooms.
     * @param event - The event to emit.
     * @param roomIds - The IDs of the rooms.
     */
    emitEventToRooms( event:IHubEvent<unknown> , ...roomIds:IHubRoomId<unknown>[]  ) : Promise<void>

    /**
     * Emits an event to all rooms except specified ones.
     * @param event - The event to emit.
     * @param exceptRoomIds - The IDs of the rooms to exclude.
     */
    emitEventToAllExceptRooms( event:IHubEvent<unknown> , ...exceptRoomIds:IHubRoomId<unknown>[]  ) : Promise<void>


    /**
     * Adds an event listener to a specific room.
     * @param roomId - The ID of the room.
     * @param event - The event to listen for.
     * @param handler - The handler for the event.
     * @returns The added EventListener or null if the room does not exist.
     */
    addEventListenerOnRoom( roomId:IHubRoomId<unknown>, event:string, handler:EvenHandler ) : Promise<EventListener | null>
    
    /**
     * Removes a specific event listener from a room.
     * @param roomId - The ID of the room.
     * @param event - The event to stop listening for.
     * @param listener - The listener to remove.
     */
    removeEventListenerFromRoom( roomId:IHubRoomId<unknown>, event:string, listener:EventListener ) : Promise<void>

    /**
     * Clears all listeners for a specific event in a room.
     * @param roomId - The ID of the room.
     * @param event - The event to clear listeners for.
     */
    clearEventListenersOnRoom( roomId:IHubRoomId<unknown>, event:string ) : Promise<void>
}