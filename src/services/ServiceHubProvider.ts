import "server-only"

import { NotificationsHub } from "./hubs/notificationHub/NotificationsHub";
import { IHubWithRooms } from "./hubs/IHubWithRooms";
import { SocketIoServer } from "./SocketIoServer";

declare global 
{
    var _servicesHubProviderInstance: ServicesHubProvider | undefined;
}

export class ServicesHubProvider {
    private static instance: ServicesHubProvider | null = null;
    private static readonly services = new Map<string, unknown>();

    private constructor() 
    {
        if( !process.env.SOCKET_IO_HOST || !process.env.SOCKET_IO_PORT )
            throw new Error("missing .env variables SOCKET_IO_HOST or SOCKET_IO_PORT");

        const socketIoServer = SocketIoServer.getInstance(
            process.env.SOCKET_IO_HOST as string, 
            process.env.SOCKET_IO_PORT as unknown as number
            ,{
                cors: {
                  origin: process.env.URL,
                  methods: ["GET", "POST"],
                //   credentials: true
                },
                transports: ["websocket", "polling"],
                // maxHttpBufferSize:1e8 ,// 100 MB,,
                allowUpgrades: false,
                perMessageDeflate: false,
            }
        )
        const notificationHub: IHubWithRooms = new NotificationsHub( socketIoServer.getIo() , socketIoServer.getConnectionLink() );

        this.registerServices({
            "IHubWithRooms": notificationHub
        });
    }

    private registerServices(services: { [key: string]: unknown }): void {
        for (const [type, service] of Object.entries(services)) {
            if (ServicesHubProvider.services.has(type)) {
                throw new Error(`Service ${type} is already registered.`);
            }
            ServicesHubProvider.services.set(type, service);
        }
    }

    get<T>(type: string): T {
        const service = ServicesHubProvider.services.get(type);
        if (!service) {
            throw new Error(`Service ${type} not registered.\n Registered services are: ${Array.from(ServicesHubProvider.services.keys()).join(", ")}`);
        }
        return service as T;
    }

    static getInstance(): ServicesHubProvider
    {
        if (!global._servicesHubProviderInstance)
        {
            ServicesHubProvider.instance = new ServicesHubProvider();
            global._servicesHubProviderInstance = ServicesHubProvider.instance;
            return ServicesHubProvider.instance;
        }
        
        return global._servicesHubProviderInstance
    }
}