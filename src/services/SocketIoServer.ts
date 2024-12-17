import { createServer, Server as HttpServer } from "http";
import { Server as IOServer, ServerOptions } from "socket.io";

declare global 
{
    var _SocketIoServer: SocketIoServer | undefined;
}

export class SocketIoServer 
{
    private static instance: SocketIoServer | null = null;

    private io: IOServer | null = null;
    private httpServer: HttpServer | null = null;
    private host: string;
    private port: number;

    private constructor(host: string, port: number, options?: Partial<ServerOptions>) {
        this.host = host;
        this.port = port;

        this.httpServer = createServer();
        this.io = new IOServer(this.httpServer, options);

        // Start the server
        this.httpServer.listen(this.port, this.host, () => {
            console.log(`Socket.IO server is running on http://${this.host}:${this.port}`);
        });
    }

    /**
     * Get the singleton instance of the SocketIoServer.
     * @param host The hostname for the server.
     * @param port The port for the server.
     * @param options Optional Socket.IO server options.
     * @returns The singleton instance of the SocketIoServer.
     */
    public static getInstance(host: string, port: number, options?: Partial<ServerOptions>): SocketIoServer 
    {
        if (!global._SocketIoServer) {
            global._SocketIoServer = new SocketIoServer(host, port, options);
        }
        return global._SocketIoServer;
    }

    /**
     * Get the Socket.IO server instance.
     * @returns The Socket.IO server instance.
     */
    public getIo(): IOServer 
    {
        if (!this.io) {
            throw new Error("Socket.IO server is not initialized.");
        }
        return this.io;
    }

    /**
     * Get the connection link for the server.
     * @returns The connection link as a string (e.g., "http://localhost:3001").
     */
    public getConnectionLink(): string {
        return `http://${this.host}:${this.port}`;
    }
}
