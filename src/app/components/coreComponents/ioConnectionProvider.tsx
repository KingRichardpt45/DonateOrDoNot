"use client"

import {IRoomHubClientConnection} from "@/services/hubs/IRoomHubClientConnections";
import {NotificationHubClientConnection} from "@/services/hubs/notificationHub/NotificationHubClientConnection";
import {createContext, useContext, useRef, useState} from "react";

const ConnectionHubContext = createContext<IRoomHubClientConnection | null>(null);

export function useConnectionContext(exec:boolean = true)  
{   
  if(exec)
  {
    const context = useContext(ConnectionHubContext);
    if (!context) 
    {
      throw new Error("useConnectionContext must be used within a HubProvider");
    }
    return context;
  }
  return null;
};

const IoConnectionProvider: React.FC<{children:React.ReactNode,connectionLink:string}> = ({ children, connectionLink}) => {

    const [firstRender ] = useState({isFirst:true})
     
    //console.log("called IoConnectionProvider");

    const connection = useRef<NotificationHubClientConnection|null>(null); 

    if((typeof window) === "undefined")
    {
      //console.log("ONserver--------------");
      return ( <div>{children}</div>)
    }
    else
    {
      //console.log("ONclient---------------");

      if(firstRender.isFirst)
      {
        //console.log("ONclient---------------2");
        connection.current = new NotificationHubClientConnection(connectionLink);
        firstRender.isFirst= false;
      }

      return (
        <ConnectionHubContext.Provider value={ connection.current }>
          <div>{children}</div>
        </ConnectionHubContext.Provider>
      );
    }
};

export default IoConnectionProvider;