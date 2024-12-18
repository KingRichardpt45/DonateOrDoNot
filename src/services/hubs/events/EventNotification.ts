import {Notification} from "@/models/Notification";
import {IHubEvent} from "../IHubEvent";

export class EventNotification implements IHubEvent<Notification>
{
    readonly name: string;
    readonly data: Notification;

    constructor(notification:Notification)
    {
        this.name = EventNotification.name
        this.data = notification;
    }
}