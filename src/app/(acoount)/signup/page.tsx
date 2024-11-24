import { MainLayout } from "@/app/components/coreComponents/mainLayout";
import SignUpForm from "@/app/components/signup/signupForm";

export default function SignUp() {
  return (
    <MainLayout setUser={()=>{}}>
      <SignUpForm/>
    </MainLayout>
  );
}
