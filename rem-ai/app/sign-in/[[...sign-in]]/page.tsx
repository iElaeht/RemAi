import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen bg-slate-950 p-4">
      <SignIn />
    </div>
  );
}