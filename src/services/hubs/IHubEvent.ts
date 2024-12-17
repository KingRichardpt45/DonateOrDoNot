export interface IHubEvent<Data>
{
    readonly name:string;
    
    readonly data:Data
}