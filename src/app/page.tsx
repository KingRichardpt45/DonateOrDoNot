import Image from "next/image";
import styles from "./page.module.css";
import {Header} from "./components/NavBarNotLogged";
import Campaign from "./components/campaign"
import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import {HeaderL} from "./components/NavBarLogged";
import { MainLayout } from "./components/coreComponents/mainLayout";

export default async function Home() 
{
  return (
    <MainLayout setUser={()=>{}}>
    <div className={styles.page}>
      <main className={styles.main}> 
        <Campaign/>
      </main> 
    </div>
    </MainLayout>
  );
}