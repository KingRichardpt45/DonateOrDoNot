import {IHubRoomId} from "../IHubRoomId";

export class NotificationHubRoomId implements IHubRoomId<string>
{
    readonly value: string;

    constructor(id:string)
    {
        this.value = id;
    }
}