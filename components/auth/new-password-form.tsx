import React from 'react'
import {cn} from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function NewPasswordForm({
                                            className,
                                            ...props
                                        }: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                    <CardDescription>
                        Enter your new password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">New password</FieldLabel>
                                </div>
                                <Input id="password" type="password" required/>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Confirm password</FieldLabel>
                                </div>
                                <Input id="repeatPassword" type="password" required/>
                            </Field>
                            <Field>
                                <Button type="submit">Accept</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

