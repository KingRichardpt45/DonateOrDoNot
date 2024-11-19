import Image from "next/image";
import styles from "./page.module.css";

import SideMenu from "./components/SideMenu";
import {Header} from "./components/NavBarNotLogged";
import {ExpandableSearchBar} from "./components/searchBar";
import Campaign from "./components/campaign"
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { User } from "@/models/User";
import { headers } from 'next/headers';
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { redirect } from "next/navigation"
import {HeaderL} from "./components/NavBarLogged";
export default async function Home() 
{

  let a = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
   
  if ( !await a.hasRole(UserRoleTypes.Donor))
  { return (
    <div className={styles.page}>
        
    <main className={styles.main}> 
      <Header/>
    <Campaign/>
    </main> 
  </div>);
  } 
  else{
    return (
      <div className={styles.page}>
        
        <main className={styles.main}> 
          <HeaderL/>
        <Campaign/>
        </main> 
      </div>
    );}
}