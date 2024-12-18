import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { MainLayout } from "../components/coreComponents/mainLayout";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { User } from "@/models/User";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import NotAuthorized from "../components/authorization/notAuthorized";
import styles from "./page.module.css"; // CSS module for styling
import { ShopItem } from "../components/storeItem/shopItem";
import { StoreItem } from "@/models/StoreItem";
import { StorePage } from "../components/storeItem/storePage";


const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");


export default async function shop() 
{
  
    const user = await userProvider.getUser();
    const authorized = user !== null && (user as User).type == UserRoleTypes.Donor; 

    return (
        <MainLayout passUser={user}>
            {
            !authorized &&
            <NotAuthorized/>
            }
            {
            (authorized || user === null) &&
                <StorePage userID={user?.id!} />
            }
        </MainLayout>
    );
}