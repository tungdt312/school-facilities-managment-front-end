"use client"

import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Building2, FileText, Hash, Loader2, Pencil, Save, X} from 'lucide-react'
import {toast} from 'sonner'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {BuildingResponse} from "@/dtos/building"
import {MOCK_BUILDINGS} from "@/components/mock-data/areas-data"
import {getBuildingById, putBuilding} from "@/services/areaService";

const buildingSchema = z.object({
    buildingName: z.string().min(1, "Building name is required"),
    floorCount: z.number().min(1, "Must have at least 1 floor"),
    note: z.string().optional(),
})

type BuildingFormValues = z.infer<typeof buildingSchema>

export function BuildingInfoCard({id}: { id: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [building, setBuilding] = useState<BuildingResponse | undefined>(undefined)

    const form = useForm<BuildingFormValues>({
        resolver: zodResolver(buildingSchema),
        defaultValues: {buildingName: "", floorCount: 1, note: ""},
    })

    useEffect(() => {
        const fetchBuilding = async () => {
            setLoading(true)
            try {
                const res = await getBuildingById(id)
                setBuilding(res)
                form.reset({
                    buildingName: res.buildingName,
                    floorCount: res.floorCount,
                    note: res.note || "",
                })
            }catch (error) {
                toast.error("Failed to load buildings")
            } finally {
                setLoading(false)
            }
        }
        fetchBuilding()
    }, [id, form])

    const onSubmit = async (values: BuildingFormValues) => {
        setLoading(true)
        try {
            const res = await putBuilding(values, id)
            toast.success("Building updated successfully")
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to update building")
        } finally {
            setLoading(false)
        }
    }

    if (!building) return null

    return (
        <Card className="w-full max-w-4xl mx-auto border-muted/40 border-1">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <CardTitle className="font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary"/> Building Detail [{id}]
                </CardTitle>
                {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                        <Pencil className="h-4 w-4"/> Edit
                    </Button>
                ) : (
                    <Button variant="ghost" size="sm" onClick={() => {
                        form.reset();
                        setIsEditing(false)
                    }} className="text-destructive">
                        <X className="h-4 w-4 mr-1"/> Cancel
                    </Button>
                )}
            </CardHeader>

            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col gap-8 md:flex-row md:items-start">
                            {/* Left: Visual Icon Section */}
                            <div
                                className="flex flex-col items-center gap-4 md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
                                <div
                                    className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/5 shadow-sm">
                                    <Building2 className="h-12 w-12 text-primary"/>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-medium text-foreground">{form.getValues("buildingName")}</h3>
                                </div>
                            </div>

                            {/* Right: Form Fields Section */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="buildingName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><Building2
                                                    className="h-3.5 w-3.5"/> Building Name</FormLabel>
                                                <FormControl><Input {...field} disabled={!isEditing}
                                                                    className={!isEditing ? "bg-muted/50" : ""}/></FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="floorCount"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><Hash
                                                    className="h-3.5 w-3.5"/> Total Floors</FormLabel>
                                                <FormControl><Input type="number" {...field} disabled={!isEditing}
                                                                    className={!isEditing ? "bg-muted/50" : ""}/></FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="note"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><FileText
                                                className="h-3.5 w-3.5"/> Note</FormLabel>
                                            <FormControl><Input {...field} disabled={!isEditing}
                                                                className={!isEditing ? "bg-muted/50" : ""}/></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {isEditing && (
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={loading} className="gap-2">
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                                <Save className="h-4 w-4"/>} Save Building
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