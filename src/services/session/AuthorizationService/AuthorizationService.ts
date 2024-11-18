import { IAuthorizationService } from "./IAuthorizationService";
import { IUserProvider } from "../userProvider/IUserProvider";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { redirect, RedirectType } from "next/navigation";

/**
 * Service to handle user authorization tasks, such as session validation, 
 * role-based access control, and redirection for unauthorized access.
 */
export class AuthorizationService implements IAuthorizationService
{
    readonly userProvider: IUserProvider;
    private readonly noSessionPage:string;
    private readonly noRolePage:string;

    /**
     * Creates an instance of AuthorizationService.
     * 
     * @param userProvider - A provider for retrieving the current user's session and details.
     */
    constructor( userProvider:IUserProvider, noSessionPageUrl:string, noRolePageUrl:string  )
    {
        this.userProvider = userProvider;
        this.noSessionPage = noSessionPageUrl;
        this.noRolePage = noRolePageUrl;
    }

    async hasSession(): Promise<boolean> 
    {
        return await this.userProvider.getUser() != null;
    }

    async hasRole( role: UserRoleTypes ): Promise<boolean> 
    {
        const user = await this.userProvider.getUser();

        if(!user)
            return false;
        else
            return user.type === role;

    }

    async authorizeRedirect( requiredRole: UserRoleTypes, redirectTo?: string): Promise<void> 
    {
        let noSessionPage;
        let noRolePage;
        if(redirectTo)
        {
            noSessionPage = redirectTo;
            noRolePage = redirectTo;
        }
        else
        {
            noSessionPage = this.noSessionPage;
            noRolePage = this.noRolePage;
        }

        const user = await this.userProvider.getUser();
        console.log("user",user);
        if (!user)
            redirect(noSessionPage,RedirectType.replace);
        
        if( user.type !== requiredRole )
            redirect(noRolePage,RedirectType.replace);   
    }
    
}