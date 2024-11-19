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

export default async function Home() 
{

  let a = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
   
  if ( !await a.hasRole(UserRoleTypes.Donor))
  {
      console.log("no user");
      redirect("signin");
      return;
  } 
  else{
    return (
      <div className={styles.page}>
        
        <main className={styles.main}>
        <ExpandableSearchBar/>  
        <Campaign/>
        </main> 
      </div>
    );}
}