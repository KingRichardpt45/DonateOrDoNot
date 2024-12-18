import {Mutex} from "async-mutex";

export class VarSync<T>
{
    private readonly variable:T;
    private readonly mutex;

    constructor(variable:T)
    {
        this.variable=variable;
        this.mutex = new Mutex();
    }

    runExclusive<ReturnT>(callback:(variable:T)=>ReturnT) : Promise<ReturnT>
    {
        return this.mutex.runExclusive( async ()  => 
        {   
            return callback(this.variable);
        }
        );
    }
}