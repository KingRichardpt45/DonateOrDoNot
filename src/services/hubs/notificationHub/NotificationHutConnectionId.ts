import {IHubConnectionId} from "../IHubConnectionId";

export class NotificationHubConnectionId implements IHubConnectionId<string>
{
    readonly value: string;

    constructor(id:string)
    {
        this.value = id;
    }
} 