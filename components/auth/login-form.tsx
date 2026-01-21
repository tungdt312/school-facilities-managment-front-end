"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import z from "zod"
import React, { useState } from "react"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import Link from "next/link";
import {login} from "@/services/authService";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, USER_ROLE_KEY} from "@/constaints";
import {useRouter} from "next/navigation";
const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    console.log("Logging in with:", data)
    try{
      const res = await login(data)

      localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user))
      toast.success("Login successful! Redirecting...")
      router.push("/dashboard")
    } catch (e) {
      toast.error((e as Error).message || "Something went wrong...")
    } finally {
      setIsLoading(false)
    }
    // You would typically redirect the user here
  }
  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                        href="/forgotPW"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" placeholder={"********"} {...register("password")}/>
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </Field>
                <Field>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}
