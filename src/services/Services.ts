import "server only"

import {DBConnectionService} from "@/services/DBConnectionService";
import {SessionService} from "@/services/session/SessionService";
import {LocalSessionUserCacheService} from "@/services/session/sessionCachingService/LocalSessionUserCacheService";
import {JWTEncryption} from "@/core/utils/encryption/JWTEncryption";
import {UserProvider} from "@/services/session/userProvider/UserProvider";
import {PasswordEncryption} from "@/core/utils/encryption/PasswordEncryption";
import {RepositoryAsync} from "@/core/repository/RepositoryAsync";
import {User} from "@/models/User";
import {AuthorizationService} from "@/services/session/authorizationService/AuthorizationService";
import {PasswordValidation} from "@/services/PasswordVaidation";
import { FileService } from "./FIleService";

export class Services {
    private static instance: Services | null = null;
    private static readonly services = new Map<string, unknown>();

    private constructor() 
    {
        const encryption = new JWTEncryption();
        const dbConnection = new DBConnectionService("development");
        const userCachingService = new LocalSessionUserCacheService(3600 * 1000, 2, new RepositoryAsync(User, dbConnection.dbConnection));
        const sessionService = new SessionService(encryption, userCachingService);
        const userProvider = new UserProvider(sessionService, userCachingService);
        const authorizationService = new AuthorizationService(userProvider, "/signin", "/unauthorized");
        const fileService = new FileService("public/documents");
        fileService.init();

        this.registerServices({
            "DBConnectionService": dbConnection,
            "SessionService": sessionService,
            "IUserProvider": userProvider,
            "PasswordEncryption": new PasswordEncryption(process.env.PW_ENCRYPTION_KEY as string),
            "IPasswordValidation": new PasswordValidation(),
            "IAuthorizationService": authorizationService,
            "FileService": fileService
        });
    }

    private registerServices(services: { [key: string]: unknown }): void {
        for (const [type, service] of Object.entries(services)) {
            if (Services.services.has(type)) {
                throw new Error(`Service ${type} is already registered.`);
            }
            Services.services.set(type, service);
        }
    }

    get<T>(type: string): T {
        const service = Services.services.get(type);
        if (!service) {
            throw new Error(`Service ${type} not registered.\n Registered services are: ${Array.from(Services.services.keys()).join(", ")}`);
        }
        return service as T;
    }

    static getInstance(): Services {
        if (!Services.instance) Services.instance = new Services();
        return Services.instance;
    }
}