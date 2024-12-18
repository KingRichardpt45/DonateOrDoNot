import {IHubConnectionId} from "./IHubConnectionId";

export interface IHubServerConnection<Data>
{
    readonly id : IHubConnectionId<any>;

    readonly data: Data;
}