import { Notification } from "@/models/Notification";
import { EntityManager } from "./EntityManager";
import { NotificationHubClientConnection } from "@/services/hubs/notificationHub/NotificationHubClientConnection";
import { ServicesHubProvider } from "@/services/ServiceHubProvider";
import { RetransmissionEvent } from "@/services/hubs/events/RetransmissionEvent";
import { EventNotification } from "@/services/hubs/events/EventNotification";
import { RoomIdGenerator } from "@/services/hubs/notificationHub/RoomIdGenerator";

export class NotificationManager extends EntityManager<Notification> 
{
    private readonly hubConnection;
    constructor()
    {
        super(Notification);
        this.hubConnection = new NotificationHubClientConnection(ServicesHubProvider.getConnectionLink());
    }
    
    async sendNotification(notification:Notification): Promise<void>
    {
        if (!notification.user_id)
            return;

        const createdNotification = await this.add(notification);
        await this.hubConnection.addAfterConnectionHandler( ()=>{

            this.hubConnection.emitEvent(
                new RetransmissionEvent( { 
                    toConnection:null,
                    toRom:RoomIdGenerator.generateUserRoom(createdNotification.user_id!),
                    originalEvent:new EventNotification(createdNotification)
                }) 
            )

        } )

        this.hubConnection.disconnect();
    }
}