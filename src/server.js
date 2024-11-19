import { createServer } from "node:http";
import next from "next";
// import { Services } from "./services/Services"
// import { DBConnectionService } from "./services/DBConnectionService"
// import { SessionService } from "./services/session/SessionService"
// import { LocalSessionUserCacheService } from "./services/session/LocalSessionUserCacheService"
// import { JWTEncryption } from "./core/Utils/encryption/JWTEncryption"
// import { UserProvider } from "./services/userProvider/UserProvider"
//import { Server } from "socket.io";


//start
startServer();









function registerServices()
{   
    // let encryption = new JWTEncryption();
    // let sessionService = new SessionService(encryption);

    // let userCachingService = new LocalSessionUserCacheService(3600*1000);
    // let userProvider = new UserProvider(userCachingService);

    // Services.register( DBConnectionService, new DBConnectionService("development") );
    // Services.register( SessionService , sessionService);
    // Services.register( UserProvider , userProvider);
}


function configureSocketIo( httpServer )
{
  // const io = new Server(httpServer);

  //   io.on("connection", (socket) => {
  //     // ...
  //   });
}


function startServer()
{
  const dev = true //process.env.NODE_ENV !== "production";
  const hostname = "localhost";
  const port = 3000;
  const app = next({ dev, hostname, port });
  const handler = app.getRequestHandler();

  app.prepare().then(() => {
      const httpServer = createServer(handler);

  

    httpServer
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
      });
  });
}