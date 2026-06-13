import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen bg-slate-950 p-4">
      <SignUp />
    </div>
  );
}