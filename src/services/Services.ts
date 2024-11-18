import { DBConnectionService } from "@/services/DBConnectionService"
import { SessionService } from "@/services/session/SessionService"
import { LocalSessionUserCacheService } from "@/services/session/sessionCachingService/LocalSessionUserCacheService"
import { JWTEncryption } from "@/core/utils/encryption/JWTEncryption"
import { UserProvider } from "@/services/session/userProvider/UserProvider"
import { IPasswordValidation } from "./IPasswordValidation"
import { IEncryption } from "@/core/utils/encryption/IEncryption"
import { PasswordEncryption } from "@/core/utils/encryption/PasswordEncryption"
import { PasswordValidation } from "./PasswordVaidation"
import { IUserProvider } from "./session/userProvider/IUserProvider"
import { RepositoryAsync } from "@/core/repository/RepositoryAsync"
import { User } from "@/models/User"
import { IAuthorizationService } from "./session/authorizationService/IAuthorizationService"
import { AuthorizationService } from "./session/authorizationService/AuthorizationService"

/**
 * A class that manages a collection of services.
 * It allows for registering services and retrieving them by type.
 */
export class Services
{
    private static instance : Services | null = null;

    // A static array that stores the services registered with their respective types.
    private static readonly services = new Map<string, unknown>();

    // Private constructor to prevent instantiation.
    private constructor() 
    {
        let encryption = new JWTEncryption();
        let userCachingService = new LocalSessionUserCacheService(3600*1000, 2, new RepositoryAsync(User) );
        let sessionService = new SessionService(encryption,userCachingService);
        let userProvider = new UserProvider(sessionService,userCachingService);
        let authorizationService = new AuthorizationService( userProvider, "/signin", "/unauthorized");

        Services.register<DBConnectionService>( "DBConnectionService", new DBConnectionService("development") );
        Services.register<SessionService>( "SessionService" , sessionService);
        Services.register<IUserProvider>( "IUserProvider" , userProvider);
        Services.register<IEncryption>( "PasswordEncryption" , new PasswordEncryption( process.env.PW_ENCRYPTION_KEY as string ) );
        Services.register<IPasswordValidation>( "IPasswordValidation" , new PasswordValidation() );
        Services.register<IAuthorizationService>( "IAuthorizationService" , authorizationService );
    }

    /**
     * Registers a service with a given type.
     * 
     * @param type - The type (constructor) of the service being registered.
     * @param service - The instance of the service to be registered.
     * 
     * @example 
     * Services.register(MyService, new MyService());
     */
    private static register<T>(type: string, service: T): void 
    {
        if (Services.services.keys().find( (k) => k === type) ) 
        {
            throw new Error(`Service ${type} is already registered.`);
        }
        Services.services.set( type, service );
    }

     /**
     * Retrieves a registered service by its type.
     * 
     * If the service is not found, an error is thrown.
     * 
     * @param checkType - The type (constructor) of the service to be retrieved.
     * 
     * @returns The service instance associated with the provided type.
     * 
     * @throws {Error} Throws an error if the service is not registered.
     * 
     * @example 
     * const myService = Services.get(MyService);
     */
    get<T>(type: string): T {
        
        for (const [key,value] of Services.services.entries()) {
            if (key === type ) {
                return value as T;
            }
        }
        
        throw new Error(`Service ${type} not registered.\n Registered services are: ` + Services.services.keys().toArray().toString() );
    }

    /**
     * Retrieves the created instance;
     * @returns Services instance
     */
    static getInstance() : Services
    {
        if(!Services.instance)
            Services.instance = new Services();

        return Services.instance;
    }
}