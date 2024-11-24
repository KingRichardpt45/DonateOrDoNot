import styles from "./mainlayout.module.css"
import Footer from "../footer";
import { User } from "@/models/User";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { Header } from "../NavBarNotLogged";

type PropType =
{
    children:React.ReactNode
    setUser: ( user:User | null ) => void
}

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

export const MainLayout: React.FC<PropType> = async ({ children , setUser}) => {
    
    const user = await userProvider.getUser();
    setUser(user);
    
    return (
        <div className={styles.MainContainer} >
            <Header/>
            <div className={styles.PageContentContainer} >
                {children}
                <Footer/>
            </div>
        </div>
    );
  };