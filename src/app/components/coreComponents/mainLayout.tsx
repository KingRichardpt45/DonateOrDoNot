import styles from "./mainlayout.module.css"
import Footer from "../footer";
import { User } from "@/models/User";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { Header } from "../NavBarNotLogged";
import { HeaderL } from "../NavBarLogged";
import { File } from "@/models/File";
import { IHubWithRooms } from "@/services/hubs/IHubWithRooms";
import { ServicesHubProvider } from "@/services/ServiceHubProvider";
import { NotificationManager } from "@/core/managers/NotificationManager";
import { Constraint } from "@/core/repository/Constraint";
import { Operator } from "@/core/repository/Operator";
import { Notification } from "@/models/Notification";
import { EntityConverter } from "@/core/repository/EntityConverter";
import IoConnectionProvider from "./ioConnectionProvider";

type PropType =
{
    children:React.ReactNode
    passUser:User | null
}

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const hubWithRooms = ServicesHubProvider.getInstance().get<IHubWithRooms>("IHubWithRooms");
const entityConverter =  Services.getInstance().get<EntityConverter>("EntityConverter");
const notificationManager = new NotificationManager();

export const MainLayout: React.FC<PropType> = async ({ children , passUser}) => {
    
    const user = passUser ? passUser : await userProvider.getUser();
    const notificationsObject = user ? await notificationManager.getByCondition( [new Constraint("user_id",Operator.EQUALS,user.id)] ) : [];
    const notificationsPlain:Notification[] = []
    notificationsObject.forEach( (notification) => { notificationsPlain.push( entityConverter.toPlainObject(notification) as Notification) } )
    
    let image : string | null = null;
    if(user && user.profileImage.value && (user.profileImage.value as File).id != null)
    {
        image =`${(user.profileImage.value as File).id}_${(user.profileImage.value as File).original_name}` 
    }

    return (
        <IoConnectionProvider connectionLink={hubWithRooms.getConnectionLink()}>
            <div className={styles.MainContainer} >
                { user != null && <HeaderL userImage={image} userId={user.id!} userName={`${user.first_name} ${user.last_name}`} userType={user.type} notifications={notificationsPlain as Notification[]}/> }
                { user == null && <Header/> }
                <div className={styles.PageContentContainer} >
                    {children}
                    <Footer/>
                </div>
            </div>
        </IoConnectionProvider>
    );
  };