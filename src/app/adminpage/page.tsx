"use server";

import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { User } from "@/models/User";
import NotAuthorized from "../components/authorization/notAuthorized";
import NotLoggedIn from "../components/authorization/notLogged";
import { MainLayout } from "../components/coreComponents/mainLayout";
import AdminPanel from "./searchFilters"; // Import the client-side component

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

export default async function Admin() {
  const user = await userProvider.getUser();
  const authorized = user !== null && (user as User).type == UserRoleTypes.CampaignManager;

  const campaigns = [
    { id: 1, title: "Donate Blood", description: "Save lives!", state: "Pending" },
    { id: 2, title: "Food Drive", description: "Support families in need", state: "Completed" },
    { id: 3, title: "Hope For Orphans", description: "Help orphaned children", state: "Pending" },
  ];

  const users = [
    { id: 1, name: "Jonas", email: "jonas@gmail.com", state: "Pending" },
    { id: 2, name: "Maria", email: "maria@gmail.com", state: "Completed" },
    { id: 3, name: "Ali", email: "ali@gmail.com", state: "In Analysis" },
    { id: 4, name: "Jonas2", email: "jonas2@gmail.com", state: "Pending" },
  ];

  return (
    <MainLayout passUser={user}>
      {user === null && <NotLoggedIn />}
      {!authorized && <NotAuthorized />}
      {authorized && <AdminPanel campaigns={campaigns} users={users} />}
    </MainLayout>
  );
}
