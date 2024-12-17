import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { MainLayout } from "./components/coreComponents/mainLayout";
import HomeContent from "./components/campaign";

const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");

export default async function Home() 
{
  
  const isAuthorized = await authorizationService.getId() != null;  

  return (
    <MainLayout passUser={null}>
        <HomeContent isAuthorized={isAuthorized}/>
    </MainLayout>
  );
}