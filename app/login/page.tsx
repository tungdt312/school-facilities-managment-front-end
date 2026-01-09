import { LoginForm } from "@/components/auth/login-form"

export default function Page() {
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10 bg-primary gap-4">
        <h1 className={"text-primary-foreground font-semibold text-xl"}>Department of Facilities Management – University A</h1>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
