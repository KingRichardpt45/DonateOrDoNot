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
  const authorized = user !== null && (user as User).type == UserRoleTypes.Admin;

  const campaigns = [
    {
      id: 1,
      title: "Campaign 1",
      description: "This is the first campaign.",
      state: "Pending",
    },
    {
      id: 2,
      title: "Campaign 2",
      description: "This is the second campaign.",
      state: "In Analysis",
    },
  ];
  
  const users = [
    {
      id: 1,
      name: "John Doe",
      type: "Autonomous",
      email: "john.doe@example.com",
      creatorName: "John Doe Co.",
      address: "123 Main St, Cityville",
      pdf: "https://example.com/user-doc.pdf", // Optional
      state: "Pending",
    },
    {
      id: 2,
      name: "Jane Smith",
      type: "Institution",
      email: "jane.smith@example.com",
      creatorName: "Admin User",
      address: "456 Elm St, Townsville",
      pdf: null, // No PDF available
      state: "In Analysis",
    },
    {
      id: 3,
      name: "John Doe2",
      type: "Autonomous",
      email: "john.doe@example.com",
      creatorName: "John Doe2 Co.",
      address: "123 Main St, Cityville",
      pdf: "https://example.com/user-doc.pdf", // Optional
      state: "Pending",
    },
    {
      id: 4,
      name: "John Doe2",
      type: "Autonomous",
      email: "john.doe@example.com",
      creatorName: "John Doe2 Co.",
      address: "123 Main St, Cityville",
      pdf: "https://example.com/user-doc.pdf", // Optional
      state: "Pending",
    },
    
  ];

  return (
    <MainLayout passUser={user}>
      {user === null && <NotLoggedIn />}
      {!authorized && <NotAuthorized />}
      {authorized && <AdminPanel campaigns={campaigns} users={users} />}
    </MainLayout>
  );
}
