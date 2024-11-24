import styles from "./mainlayout.module.css"
import Footer from "../footer";
import { User } from "@/models/User";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { Header } from "../NavBarNotLogged";
import { HeaderL } from "../NavBarLogged";
import { File } from "@/models/File";

type PropType =
{
    children:React.ReactNode
    setUser: ( user:User | null ) => void
}

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

export const MainLayout: React.FC<PropType> = async ({ children , setUser}) => {
    
    const user = await userProvider.getUser();
    setUser(user);
    let image : string | null = null;
    if(user && user.profileImage.value && (user.profileImage.value as File).id != null)
    {
        image =`${(user.profileImage.value as File).id}_${(user.profileImage.value as File).original_name}` 
    }

    return (
        <div className={styles.MainContainer} >
            { user != null && <HeaderL userImage={image} userName={`${user.first_name} ${user.last_name}`} userType={user.type}/> }
            { user == null && <Header/> }
            <div className={styles.PageContentContainer} >
                {children}
                <Footer/>
            </div>
        </div>
    );
  };