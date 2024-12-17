import { EvenHandler, EventListener } from "../IHub";
import { IHubEvent } from "../IHubEvent";
import { IHubRoom } from "../IHubRoom";
import { ListenerRegistry } from "./ListenerRegistry";
import { NotificationHubRoomId } from "./NotificationHubRoomId" ;
import { NotificationServerHubConnection } from "./NotificationHubServerConnection";
import { NotificationHubConnectionId } from "./NotificationHutConnectionId";
import { Server } from "socket.io";

export class NotificationHubRoom implements IHubRoom
{
    readonly id: NotificationHubRoomId;
    private readonly server:Server;
    private readonly connections : Set<NotificationServerHubConnection>
    private readonly listenerRegistry : ListenerRegistry<string>;

    constructor(id:NotificationHubRoomId, server:Server )
    {
        this.id = id;
        this.server = server;
        this.connections = new Set<NotificationServerHubConnection>();
        this.listenerRegistry = new ListenerRegistry<string>();
    }
   
    addConnection(connection: NotificationServerHubConnection ): void 
    {
        this.connections.add(connection);
        connection.data.join(this.id.value);
        console.log(`${connection.id.value } joined room ${this.id.value}`);
    }

    removeConnection(connectionId: NotificationHubConnectionId ): void 
    {
        const connection = this.connections.values().find( ( connection ) => connection.id === connectionId);
        if(connection)
        {
            connection.data.leave(this.id.value);
            this.connections.delete(connection);
            console.log(`${connection.id.value } left room ${this.id.value}`);
        }
    }

    getConnections(): NotificationServerHubConnection[] 
    {
        return this.connections.values().toArray();
    }

    hasConnection( connectionId:NotificationHubConnectionId ): boolean 
    {
        return this.connections.values().find( ( connection ) => connection.id === connectionId) != undefined;
    } 

    close(): void
    {
        for (const connection of this.connections) 
        {
            connection.data.leave(this.id.value);
        }
    }

    emitEvent(event: IHubEvent<unknown>): void 
    {
        this.server.to(this.id.value).emit( this.getRoomEventName(event.name) ,event);
    }

    addEventListener(event: string, handler: EvenHandler): EventListener 
    {
        return this.listenerRegistry.addListener(this.getRoomEventName(event),handler,this.addSocketEventHandler);
    }

    removeEventListener(event:string, listener: EventListener): void 
    {
       this.listenerRegistry.removeListener(this.getRoomEventName(event),listener,this.removeSocketEventHandler);
    }

    clearEventListeners(event:string): void 
    {
        this.listenerRegistry.clearListeners(this.getRoomEventName(event),this.removeSocketEventHandler);
    }

    clearAllEventListeners()
    {
        this.listenerRegistry.clearAllListeners(this.removeSocketEventHandler);
    }

    private addSocketEventHandler(eventName: string, handler: EvenHandler)
    {   
        for (const connection of this.connections.values()) 
        {
            connection.data.on(eventName,handler);
        }
    }

    private removeSocketEventHandler(eventName: string, handler: EvenHandler)
    {   
        for (const connection of this.connections.values()) 
        {
            connection.data.off(eventName,handler);
        }
    }

    private getRoomEventName(event:string)
    {
        return `${this.id.value}_${event}`;
    }

    static getRoomEventName(roomId:NotificationHubRoomId,event: string)
    {
        return `${roomId}_${event}`;
    }

}