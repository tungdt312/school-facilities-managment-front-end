"use client"

import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Loader2, Mail, Pencil, Save, ShieldCheck, User, X} from 'lucide-react'
import {toast} from 'sonner'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {UserRole} from "@/constaints/enum"
import {UserResponse} from "@/dtos/user"
import {MOCK_USERS} from "@/components/mock-data/users-data";

const userSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    role: z.string().min(2, "Please select a role"),
})

type UserFormValues = z.infer<typeof userSchema>

export function UserInfoCard({id}: { id: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserResponse | undefined>(undefined)

    const fetchData = async () => {
        setLoading(true)
        setUser(MOCK_USERS.filter(u => u.userId == id)[0])
        console.log(user)
    }
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: "",
            email: "",
            role: UserRole.Student,
        },
    })
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Simulate API call
                const foundUser = MOCK_USERS.find(u => u.userId === id)
                if (foundUser) {
                    setUser(foundUser)
                    // Reset form with fetched data
                    form.reset({
                        fullName: foundUser.fullName,
                        email: foundUser.email,
                        role: foundUser.role,
                    })
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id, form])
    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin h-8 w-8 text-primary"/>
            </div>
        )
    }
    if (!user) return null
    const handleCancel = () => {
        form.reset() // Revert changes to original values
        setIsEditing(false)
    }

    async function onSubmit(values: UserFormValues) {
        setLoading(true)
        try {
            // Simulate API update call
            console.log("Saving changes:", values)
            await new Promise(r => setTimeout(r, 1000))

            toast.success("Profile updated successfully")
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to save changes")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto border-muted/40 border-1">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <CardTitle className="font-semibold">User Information</CardTitle>
                {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                        <Pencil className="h-4 w-4"/> Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCancel} className="text-destructive">
                            <X className="h-4 w-4 mr-1"/> Cancel
                        </Button>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Responsive Layout: Vertical on Mobile, Horizontal on Desktop */}
                        <div className="flex flex-col gap-8 md:flex-row md:items-start">

                            {/* Left: Avatar Section */}
                            <div
                                className="flex flex-col items-center gap-4 md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
                                <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-sm">
                                    <AvatarImage
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}/>
                                    <AvatarFallback>{user.fullName.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h3 className="font-medium text-foreground">{form.getValues("fullName")}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{form.getValues("role")}</p>
                                </div>
                            </div>

                            {/* Right: Form Fields Section */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <User className="h-3.5 w-3.5"/> Full Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!isEditing}
                                                        className={!isEditing ? "bg-muted/50 border-transparent cursor-not-allowed" : "bg-background"}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Role Selection */}
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <ShieldCheck className="h-3.5 w-3.5"/> Role
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}
                                                        disabled={!isEditing}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className={!isEditing ? "bg-muted/50 border-transparent cursor-not-allowed" : "bg-background"}>
                                                            <SelectValue placeholder="Select role"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(UserRole).map(role => (
                                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Email (Full width in its row) */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Mail className="h-3.5 w-3.5"/> Email Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    disabled={!isEditing}
                                                    className={!isEditing ? "bg-muted/50 border-transparent cursor-not-allowed" : "bg-background"}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Action Buttons: Only show when editing */}
                                {isEditing && (
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={loading}
                                                className="w-full sm:w-auto px-8 gap-2">
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                                <Save className="h-4 w-4"/>}
                                            Save Profile
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}