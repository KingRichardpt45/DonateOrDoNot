import { EvenHandler, EventListener } from "../IHub";

export class ListenerRegistry<EventId> 
{
    private readonly listenerRegistry: Map<EventId,Map<number,EventListener>>;

    constructor()
    {
        this.listenerRegistry = new Map<EventId,Map<number,EventListener>>();
    }

    addListener( eventId:EventId, handler: EvenHandler, onAdd:(eventName:EventId,handler:EvenHandler)=>void = ()=>{} ): EventListener 
    {
        const listeners = this.listenerRegistry.get(eventId);
        const newlistener :EventListener = { id:this.listenerRegistry.size + 1 ,handler };

        if(listeners)
            listeners.set(newlistener.id,newlistener);
        else
        {
            const set = new Map<number,EventListener>();
            set.set(newlistener.id,newlistener);
            this.listenerRegistry.set(eventId,set);
        }

        onAdd(eventId,handler);
        return newlistener;
    }

    removeListener(eventId:EventId, listener: EventListener, onRemove:(eventName:EventId,handler:EvenHandler)=>void = ()=>{}): void 
    {   
        const listeners = this.listenerRegistry.get(eventId);
        const listenerInRegistry = listeners?.get(listener.id);

        if( listeners && listenerInRegistry )
        {
            listeners.delete(listenerInRegistry.id);
            onRemove(eventId, listener.handler); 
        }
;
    }

    clearListeners(eventId:EventId , onRemove:(eventName:EventId,handler:EvenHandler)=>void ): void 
    {
        const listeners = this.listenerRegistry.get(eventId);
        if(listeners)
        {
            for (const listener of listeners.values()) 
            {
                onRemove(eventId, listener.handler);    
            }
            listeners.clear();
        }
    }

    clearAllListeners(onRemove:(eventId:EventId,handler:EvenHandler)=>void ): void 
    {
        for (const [key , listeners] of this.listenerRegistry.entries()) 
        {
            for (const listener of listeners.values()) 
            {
                onRemove(key,listener.handler);
            }
            listeners.clear();
        }
    }

}