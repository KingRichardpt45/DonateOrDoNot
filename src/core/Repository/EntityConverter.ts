import { IEntity } from "@/core/Repository/IEntity"

export class EntityConverter 
{
    toObject( entity: IEntity ,  ...excludes : string[] ) : { [key: string]: any }
    {
        const entries = Object.entries(entity);
        let object : { [key: string]: any } = {} 
        entries.forEach( 
            ([key, value]) => 
            {
                if( !excludes.includes(key) ) 
                {
                    object[key] = value;    
                }
            }
        );
        return object 
    }

    getObjectKeys( entity : IEntity , excludes : string[] ) : string[]
    {
        return Object.keys(entity).filter(key => !entity.getNavigationKeys().includes(key))
    }

}