import {Notification} from "@/models/Notification";
import {EntityManager} from "./EntityManager";

export class NotificationManager extends EntityManager<Notification> 
{
    constructor()
    {
        super(Notification);
    }
}