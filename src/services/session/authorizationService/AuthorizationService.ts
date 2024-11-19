import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {IUserProvider} from "../userProvider/IUserProvider";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";

/**
 * Service to handle user authorization tasks, such as session validation,
 * role-based access control, and redirection for unauthorized access.
 */
export class AuthorizationService implements IAuthorizationService {
    readonly userProvider: IUserProvider;
    private readonly noSessionPage: string;
    private readonly noRolePage: string;

    /**
     * Creates an instance of authorizationService.
     *
     * @param userProvider - A provider for retrieving the current user's session and details.
     */
    constructor(userProvider: IUserProvider, noSessionPageUrl: string, noRolePageUrl: string) {
        this.userProvider = userProvider;
        this.noSessionPage = noSessionPageUrl;
        this.noRolePage = noRolePageUrl;
    }

    async hasSession(): Promise<boolean> {
        return await this.userProvider.getUser() != null;
    }

    async hasRole(role: UserRoleTypes): Promise<boolean> {
        const user = await this.userProvider.getUser();

        if (!user)
            return false;
        else
            return user.type === role;

    }
}