import {Server} from "socket.io";
import {EvenHandler, EventListener} from "../IHub";
import {IHubEvent} from "../IHubEvent";
import {IHubRoomId} from "../IHubRoomId";
import {IHubServerConnection} from "../IHubServerConnection";
import {NotificationServerHubConnection} from "./NotificationHubServerConnection";
import {NotificationHubConnectionId} from "./NotificationHutConnectionId";
import {NotificationHubRoom} from "./NotificationHubRoom";
import {NotificationHubRoomId} from "./NotificationHubRoomId";
import {IHubWithRooms} from "../IHubWithRooms";
import {ListenerRegistry} from "./ListenerRegistry";
import {JoinRoomEvent} from "../events/JoinRoomEvent";
import {LeaveRoomEvent} from "../events/LeaveRoomEvent";
import {VarSync} from "./../../../core/utils/VarSync";

/**
 * Starting with socket.io@3.1.0, the underlying Adapter will emit the following events:

create-room (argument: room)
delete-room (argument: room)
join-room (argument: room, id)
leave-room (argument: room, id)
 */
export class NotificationsHub implements IHubWithRooms
{
    private readonly server : Server;
    private readonly connections : VarSync<Map<string, NotificationServerHubConnection>>; 
    private readonly listenerRegistry: ListenerRegistry<string>;
    private readonly rooms: VarSync<Map<string,NotificationHubRoom>>;
    private readonly connectionLink: string;

    constructor( server:Server , connectionLink:string)
    {
        this.server = server;
        this.connectionLink = connectionLink;
        this.connections = new VarSync(new Map<string,NotificationServerHubConnection>());
        this.listenerRegistry = new ListenerRegistry<string>();
        this.rooms = new VarSync(new Map<string,NotificationHubRoom>());

        this.startListeningForConnections();       

    }

    getConnectionLink(): string 
    {
        //console.log("A:1")
        return this.connectionLink;
    }
   
    async getConnections(): Promise<NotificationServerHubConnection[]> 
    {   
        //console.log("A:2")
        return await this.connections.runExclusive((connections) => { return Array.from(connections.values()) } );
    }

    async getConnectionIds(): Promise<NotificationHubConnectionId[]>
    {
        //console.log("A:3")
        const ids : NotificationHubConnectionId[] = [];
        await this.connections.runExclusive((connections) => { Array.from(connections.values()).forEach( (value) => ids.push(value.id) ); } );
        return ids;
    }
    
    async getRooms(): Promise<NotificationHubRoom[]> 
    {
        //console.log("A:4")
        return await this.rooms.runExclusive((rooms) => { return Array.from(rooms.values()) } );
    }

    async getRoomIds(): Promise<IHubRoomId<any>[]> 
    {
        //console.log("A:5")
        const ids : NotificationHubRoomId[] = [];
        await this.rooms.runExclusive((rooms) => { Array.from(rooms.values()).forEach( (value) => ids.push(value.id)); } );
        return ids;
    }

    async openRoom( roomId:NotificationHubRoomId ): Promise<NotificationHubRoom> 
    {
        //console.log("A:6")
        const newRoom = new NotificationHubRoom(roomId,this.server);
        await this.rooms.runExclusive((rooms) => { rooms.set(roomId.value, newRoom) } );
        return newRoom;
    }

    async closeRoom( roomId : NotificationHubRoomId ): Promise<void> 
    {
        //console.log("A:7")
        await this.rooms.runExclusive((rooms) => 
        { 
            const room = rooms.get(roomId.value);
            room?.close(); 
        } );
    }

    async addConnectionToRoom(connection: NotificationServerHubConnection, roomId: NotificationHubRoomId): Promise<void> 
    {
        //console.log("A:8")
        await this.rooms.runExclusive((rooms) => 
        { 
            const room = rooms.get(roomId.value);
            room?.addConnection(connection);
        } );
    }

    async removeConnectionFromRoom(connectionId: NotificationHubConnectionId, roomId: NotificationHubRoomId): Promise<void> 
    {
        //console.log("A:9")
        await this.rooms.runExclusive((rooms) => 
            { 
                const room = rooms.get(roomId.value);
                room?.removeConnection(connectionId);
            } );
    }

    async getConnectionsInRoom(roomId: IHubRoomId<any>): Promise<IHubServerConnection<unknown>[]> 
    {
        //console.log("A:10")
        return await this.rooms.runExclusive((rooms) => 
            { 
                const room = rooms.get(roomId.value);
                return room ? room.getConnections() : []; 
            } );
    }

    async getRoomsOfConnection(connectionId: NotificationHubConnectionId): Promise<NotificationHubRoom[]> 
    {
        //console.log("A:11")
        const inRooms :NotificationHubRoom[] = [];

        await this.rooms.runExclusive((rooms) => 
        { 
            for ( const room of rooms.values() ) 
            {
                if(room.hasConnection(connectionId))
                    inRooms.push(room);
            }
        } );
        return inRooms;
    }

    async hasRoom(roomId: NotificationHubRoomId): Promise<boolean> 
    {
        //console.log("A:12")
        return await this.rooms.runExclusive((rooms) => 
            { 
                return rooms.get(roomId.value) !== undefined
            } );
    }


    async emitEventToRoom(event: IHubEvent<unknown>, roomId: NotificationHubRoomId): Promise<void> 
    {
        //console.log("A:13");
        await this.rooms.runExclusive((rooms)=>{
            const room = rooms.get(roomId.value) 
            room?.emitEvent(event);
        }) 
    }

    async emitEventToRooms(event: IHubEvent<unknown>, ...roomIds: NotificationHubRoomId[]): Promise<void>  
    {
        //console.log("A:14")
        await this.rooms.runExclusive((rooms)=>
        {
            for (const roomId of roomIds) 
            {
                const room = rooms.get(roomId.value) 
                room?.emitEvent(event);
            }
        }) 
    }
    
    async emitEventToAllExceptRooms(event: IHubEvent<unknown>, ...exceptRoomIds: NotificationHubRoomId[]): Promise<void> 
    {
        //console.log("A:15")
        await this.rooms.runExclusive((rooms) => 
            { 
                for (const [key,room] of rooms.entries()) 
                {
                    if(exceptRoomIds.find((v)=>v.value === key))
                        continue;
        
                    room.emitEvent(event);
                }
            } );
        
    }

    async emitEventToConnection(event: IHubEvent<unknown>, connectionId: NotificationHubConnectionId): Promise<void> 
    {
        //console.log("A:16")
        await this.connections.runExclusive((connections)=>{
            const connection = connections.get(connectionId.value) 
            connection?.data.emit(event.name,event);
        }) 
    }

    async emitEventToConnections(event: IHubEvent<unknown>, ...connectionIds: NotificationHubConnectionId[]): Promise<void>  
    {
        //console.log("A:17")
        await this.connections.runExclusive((connections)=>
        {
            for (const connectionId of connectionIds) 
            {
                const connection = connections.get(connectionId.value) 
                connection?.data.emit(event.name,event);
            }
        }); 
    }

    async broadcastExcept(event: IHubEvent<unknown>, ...exceptConnectionIds: NotificationHubConnectionId[]): Promise<void>   
    {
        //console.log("A:18")
        await this.connections.runExclusive((connections) => 
            { 
                for (const [key,connection] of connections.entries()) 
                {
                    if(exceptConnectionIds.find((v)=>v.value === key))
                        continue;
        
                    connection.data.emit(event.name,event);
                }
            } );
    }

    async broadcast(event: IHubEvent<unknown>): Promise<void> 
    {
        //console.log("A:19")
        this.server.emit(event.name,event);
    }

    addEventListener(event: string, handler: EvenHandler): EventListener 
    {
        //console.log("A:20")
        return this.listenerRegistry.addListener(event,handler,this.addSocketEventHandler.bind(this));
    }

    removeEventListener(event: string, listener: EventListener): void 
    {
        //console.log("A:21")
        this.listenerRegistry.removeListener(event,listener,this.removeSocketEventHandler.bind(this));
    }

    clearEventListeners(event: string): void 
    {
        //console.log("A:22")
        this.listenerRegistry.clearListeners(event,this.removeSocketEventHandler.bind(this));
    }


    async addEventListenerOnRoom(roomId: NotificationHubConnectionId, event: string, handler: EvenHandler): Promise<EventListener | null>
    {
        //console.log("A:23")
        return await this.rooms.runExclusive((rooms) => 
        { 
            const room = rooms.get(roomId.value);
            if(room)
            {
                return room.addEventListener(event,handler);
            }

            return null;
        } );
    }

    async removeEventListenerFromRoom(roomId: NotificationHubConnectionId, event: string, listener: EventListener): Promise<void> 
    {
        //console.log("A:24")
        return await this.rooms.runExclusive((rooms) => 
            { 
                const room = rooms.get(roomId.value);
                if(room)
                {
                    room.removeEventListener(event,listener);
                }
            } );
    }

    async clearEventListenersOnRoom(roomId: NotificationHubConnectionId, event: string): Promise<void> 
    {
        //console.log("A:25")
        await this.rooms.runExclusive((rooms) => 
            { 
                const room = rooms.get(roomId.value);
                if(room)
                {
                    room.clearEventListeners(event);
                }
            } );
    }
    
    async clearAllEventListeners(): Promise<void> 
    {
        //console.log("A:26")
        this.listenerRegistry.clearAllListeners(this.server.off.bind(this));
        await this.rooms.runExclusive((rooms) => 
            { 
                for (const room of rooms.values()) 
                {
                    room.clearAllEventListeners();    
                }
            } );
    }


    async close(): Promise<void> 
    {
        //console.log("A:27")
        
        await this.connections.runExclusive(
            (connections)=>
            {
                for (const [key ,connection] of connections.entries()) 
                {
                    connection.data.disconnect();
                }
            })

        await this.clearAllEventListeners();
        await this.connections.runExclusive((connections)=>connections.clear())
        await this.rooms.runExclusive((rooms)=>rooms.clear())
        this.server.close();
    }
   
    private async startListeningForConnections()
    {
        //console.log("A:28")
        this.server.on("connection", async (socket) => 
        {
            console.log("New client connected:", socket.id);
            const connection = new NotificationServerHubConnection(socket);
            
            await this.connections.runExclusive( (connections)=>
                {
                    connections.set(socket.id, new NotificationServerHubConnection(socket) );
                    this.setListenersForRouteEvents(connection);
                })

        });
    }

    private async onDisconnect(connection:NotificationServerHubConnection)
    {
        //console.log("A:29")
        await this.rooms.runExclusive( (rooms)=>
        {
            for (const room of rooms.values()) {
                room.removeConnection(connection.id)
            }
        })

        await this.connections.runExclusive( (connections)=>
        {
            console.log("Client disconnected:", connection.id.value);
            connections.delete(connection.id.value);
        })
    }

    private setListenersForRouteEvents(connection:NotificationServerHubConnection)
    {
        //console.log("A:30","data",connection.data.id,connection.data.connected);
        connection.data.on(JoinRoomEvent.name,(event:JoinRoomEvent)=>{ this.handleJoinRoomEvent(event.data,connection) });

        connection.data.on(LeaveRoomEvent.name,(event:LeaveRoomEvent)=>{ this.handleLeaveRoomEvent(event.data,connection) });

        //connection.data.on(EventNotification.name,(event:EventNotification)=>{ console.log("receive notifications.") });

        connection.data.on("disconnect", () => this.onDisconnect(connection) );
    }

    private async handleJoinRoomEvent(roomId:NotificationHubRoomId,connection:NotificationServerHubConnection)
    {
        //console.log("A:31")
        if( await this.hasRoom(roomId) )
        {
            this.rooms.runExclusive( (rooms)=>
            {
                rooms.get(roomId.value)?.addConnection(connection)
                console.log("room created");
            })
        }
        else
        {
            const room = await this.openRoom(roomId);
            this.rooms.runExclusive( (rooms)=>
            {
                rooms.get(room.id.value)?.addConnection(connection)
            })
        }

        this.connections.runExclusive( (connections)=>
        {
            connections.get(connection.id.value)?.data.emit(JoinRoomEvent.name,new JoinRoomEvent(roomId));
        })
    }

    private async handleLeaveRoomEvent(roomId:NotificationHubRoomId,connection:NotificationServerHubConnection)
    {
        //console.log("A:32")
        if( await this.hasRoom(roomId) )
        {
            this.rooms.runExclusive( (rooms)=>
            {
                const room = rooms.get(roomId.value)
                room?.removeConnection(connection.id)
    
                if(room && room.getConnections().length == 0)
                {
                    rooms.delete(room.id.value);
                    console.log("room removed");
                }
            })
        }

        this.connections.runExclusive( (connections)=>
        {
            connections.get(connection.id.value)?.data.emit(LeaveRoomEvent.name,new LeaveRoomEvent(roomId));
        })
    }

    private addSocketEventHandler(eventName: string, handler: EvenHandler)
    {   
        //console.log("A:33")
        this.connections.runExclusive( (connections)=>
        {
            for (const connection of connections.values()) 
            {
                connection.data.on(eventName,handler);
            }
        })
    }

    private removeSocketEventHandler(eventName: string, handler: EvenHandler)
    {   
        //console.log("A:34")
        this.connections.runExclusive( (connections)=>
        {
            for (const connection of connections.values()) 
            {
                connection.data.off(eventName,handler);
            }
        })
    }

}