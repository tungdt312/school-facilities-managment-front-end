"use client"
import React, {useEffect, useState} from 'react'
import {cn} from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import z from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";

const formSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().min(4, "Verification code must be at least 4 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Lỗi sẽ hiển thị ở field confirmPassword
});

type FormValues = z.infer<typeof formSchema>;

export default function NewPasswordForm({
                                            className,
                                            ...props
                                        }: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            otp: "",
            password: "",
            confirmPassword: "",
        }
    });
    const emailValue = watch("email");
    // 2. Xử lý logic đếm ngược
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer); // Cleanup khi component unmount hoặc countdown = 0
    }, [countdown]);

    const handleGetCode = () => {
        if (!emailValue || errors.email) {
            toast.error("Please enter a valid email address first");
            return;
        }
        setCountdown(60);
        toast.success("Verification code sent to your email");
        console.log("Sending OTP to:", emailValue);
    };

    // 4. Xử lý khi form hợp lệ
    const onSubmit = (data: FormValues) => {
        setIsLoading(true);
        console.log("Form submitted successfully:", data);

        // Simulate API Call

        toast.success("Password changed successfully!");
        setIsLoading(false);
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                    <CardDescription>
                        Enter your email and the code sent to you to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                </div>
                                <Input id="email" type="email" placeholder="m@example.com" {...register("email")}/>
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="otp">Verify Code</FieldLabel>
                                </div>
                                <div className="flex w-full items-center space-x-2">
                                    <Input id="otp" type="text"
                                           inputMode="numeric"
                                           pattern="[0-9]*"
                                           placeholder="000000"
                                           onClick={handleGetCode}
                                           {...register("otp")}/>
                                    <Button disabled={countdown > 0} type="button" variant="outline" className="shrink-0">{countdown > 0 ? `${countdown}s` : "Get code"}</Button>
                                </div>
                                {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">New password</FieldLabel>
                                </div>
                                <Input id="password" type="password" {...register("password")}/>
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                                </div>
                                <Input id="confirmPassword" type="password" {...register("confirmPassword")}/>
                                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                            </Field>
                            <Field>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Updating..." : "Accept"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

