import {VarSync} from "@/core/utils/VarSync";
import {JoinRoomEvent} from "../events/JoinRoomEvent";
import {LeaveRoomEvent} from "../events/LeaveRoomEvent";
import {EvenHandler, EventListener} from "../IHub";
import {IHubEvent} from "../IHubEvent";
import {IHubRoomId} from "../IHubRoomId";
import {IRoomHubClientConnection} from "../IRoomHubClientConnections";
import {ListenerRegistry} from "./ListenerRegistry";
import {NotificationHubRoom} from "./NotificationHubRoom";
import {NotificationHubRoomId} from "./NotificationHubRoomId";
import {NotificationHubConnectionId} from "./NotificationHutConnectionId";
import {io as ClientIo, Socket} from "socket.io-client";

export class NotificationHubClientConnection implements IRoomHubClientConnection
{
    private id: NotificationHubConnectionId | null = null
    private readonly socket: Socket
    private readonly rooms: VarSync<Set<IHubRoomId<any>>>
    private readonly listenerRegistry : ListenerRegistry<string>;

    constructor(connectionLink:string)
    {
        console.log("connecting");
        this.socket = this.connect(connectionLink);
        this.rooms = new VarSync(new Set());
        this.listenerRegistry = new ListenerRegistry<string>();
        this.setListenerForRouteEvent();
    }
    
    getId()
    {
        if(this.id)
            return this.id
        else
            throw new Error("Trying to get id willis not yed connected.");
    }

    addAfterConnectionHandler(handler: () => void): Promise<void> 
    {
        return new Promise((resolve,reject) => {
            if (this.socket.connected) 
            {
                handler()
                //setTimeout(handler,1000);
                resolve();
            } else 
            {
                this.socket.once("connect", () => {
                    //setTimeout(handler,1000);
                    handler();
                    resolve();
                });
    
                this.socket.once("connect_error", (err: any) => {
                    reject(new Error(`Connection failed: ${err.message}`));
                    console.log("connect_error",err)
                });
            }
        });
    }

    private connect(connectionLink:string) : Socket
    {
        const clientSocket = ClientIo(connectionLink);

        clientSocket.on("connect", () => {
            this.id = new NotificationHubConnectionId( this.socket.id! );
            console.log("connected with",this.socket.id);
        });
        
        return clientSocket; 
    }

    isConnected(): boolean 
    {
        return this.socket.connected;
    }

    disconnect(): void 
    {
        this.throwIfNotConnect("disconnect");
        this.socket.disconnect();
    }

    async isInRoom( roomId: NotificationHubRoomId ): Promise<boolean> 
    {
        return this.rooms.runExclusive((rooms) => rooms.has(roomId) );
    }
    
    async getRooms(): Promise<Set<NotificationHubRoomId>> 
    {
        return this.rooms.runExclusive((rooms) => rooms );
    }

    joinRoom(roomId: NotificationHubRoomId): void 
    {
        this.throwIfNotConnect("join Room");
        this.emitEvent(new JoinRoomEvent( roomId ));
    }

    leaveRoom(roomId: NotificationHubRoomId): void 
    {
        this.throwIfNotConnect("leave Room");
        this.emitEvent(new LeaveRoomEvent( roomId ));
    }

    emitEvent(event: IHubEvent<unknown>): void 
    {
        this.throwIfNotConnect("emit Events");
        this.socket.emit(event.name,event);
    }

    addEventListener(event: string, handler: EvenHandler): EventListener 
    {
        return this.listenerRegistry.addListener(event,handler,this.socket.on.bind(this));
    }

    removeEventListener(event: string, listener: EventListener): void 
    {
        this.listenerRegistry.removeListener(event,listener);
    }

    clearEventListeners(event: string): void 
    {
        this.listenerRegistry.clearListeners(event,this.socket.off.bind(this));
    }

    clearAllEventListeners(): void 
    {
        this.listenerRegistry.clearAllListeners(this.socket.off.bind(this));
    }

    addEventListenerToRoom(roomId: NotificationHubRoomId, event: string, handler: EvenHandler): EventListener 
    {
        return this.listenerRegistry.addListener(NotificationHubRoom.getRoomEventName(roomId,event),handler,this.socket.on.bind(this)); 
    }

    removeEventListenerFromRoom(roomId: NotificationHubRoomId, event: string, listener: EventListener): void 
    {
        this.listenerRegistry.removeListener(NotificationHubRoom.getRoomEventName(roomId,event),listener,this.socket.off.bind(this)); 
    }

    clearEventListenersOfRoom(roomId: NotificationHubRoomId, event: string): void 
    {
        this.listenerRegistry.clearListeners(NotificationHubRoom.getRoomEventName(roomId,event),this.socket.off.bind(this)); 
    }

    private setListenerForRouteEvent()
    {
        this.socket.on(JoinRoomEvent.name,(event:JoinRoomEvent  )=> 
            {  
                this.rooms.runExclusive( (rooms)=> { rooms.add( event.data ); console.log(`joined room ${event.data.value}`) } );
            });

        this.socket.on(LeaveRoomEvent.name,(event:LeaveRoomEvent  )=>
            {  
                this.rooms.runExclusive( (rooms)=> { rooms.delete( event.data ); console.log(`left room ${event.data.value}`)  } );
            });

        this.socket.on("disconnect", () => this.onDisconnect() );
    }
    
    private async onDisconnect()
    {
        this.clearAllEventListeners();
        this.rooms.runExclusive( (rooms)=>rooms.clear() );
        console.log("disconnected");
    }

    private throwIfNotConnect(action:string)
    {
        if( !this.isConnected() )
            throw new Error(`Can not do: ${action}.Connect is not active!`);
    }

}