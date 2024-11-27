import { ActionDisplay } from "@/app/components/actionsNotifications/actionDisplay/ActionDisplay";
import { MainLayout } from "@/app/components/coreComponents/mainLayout";
import SignInForm from "@/app/components/signin/signInForm";

export default function SignIn() 
{
  return (
    <MainLayout passUser={null}>
      <SignInForm/>
    </MainLayout>
  );
}
