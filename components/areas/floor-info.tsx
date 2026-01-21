"use client"

import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {FileText, Hash, Layers, Layout, Loader2, Pencil, Save, X} from 'lucide-react'
import {toast} from 'sonner'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {FloorResponse} from "@/dtos/building"
import {MOCK_FLOORS_FLAT} from "@/components/mock-data/areas-data"
import Link from "next/link";
import {getBuildingById, getFloorById, putBuilding, putFloor} from "@/services/areaService";

const floorSchema = z.object({
    floorName: z.string().min(1, "Floor name is required"),
    note: z.string().optional(),
})

type FloorFormValues = z.infer<typeof floorSchema>

export function FloorInfoCard({id}: { id: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [floor, setFloor] = useState<FloorResponse | undefined>(undefined)

    const form = useForm<FloorFormValues>({
        resolver: zodResolver(floorSchema),
        defaultValues: {floorName: "", note: ""},
    })

    useEffect(() => {
        const fetchFloor = async () => {
            setLoading(true)
            try {
                const res = await getFloorById(id)
                setFloor(res)
                form.reset({
                    floorName: res.floorName,
                    note: res.note || "",
                })
            }catch (error) {
                toast.error("Failed to load floors")
            } finally {
                setLoading(false)
            }
        }
        fetchFloor()
    }, [id, form])

    const onSubmit = async (values: FloorFormValues) => {
        setLoading(true)
        try {
            const res = await putFloor(values, id)
            toast.success("Floor updated successfully")
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to update floor")
        } finally {
            setLoading(false)
        }
    }

    if (!floor && !loading) return <div className="p-4 text-center text-muted-foreground">Floor not found</div>
    if (loading) return <div className="flex justify-center p-12"><Loader2
        className="animate-spin h-8 w-8 text-primary"/></div>

    return (
        <Card className="w-full max-w-4xl mx-auto border-muted/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <CardTitle className="font-semibold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary"/> Floor Detail [{id}]
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
                        <div className="flex flex-col gap-8 md:flex-row">
                            {/* Left: Avatar-style Icon */}
                            <div
                                className="flex flex-col items-center gap-4 md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
                                <div
                                    className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/5 shadow-sm">
                                    <Layers className="h-12 w-12 text-primary"/>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-foreground text-lg">{floor?.floorName}</h3>
                                    <Link href={`/areas/building/${floor?.buildingId}`}
                                          className="text-xs text-muted-foreground font-medium bg-primary/5 px-2 py-0.5 rounded-full inline-block">
                                        {floor?.buildingName}
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Form */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="floorName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><Layout
                                                    className="h-3.5 w-3.5"/> Floor Name</FormLabel>
                                                <FormControl><Input {...field} disabled={!isEditing}
                                                                    className={!isEditing ? "bg-muted/50 border-transparent" : ""}/></FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2"><Hash
                                            className="h-3.5 w-3.5"/> Room Count</FormLabel>
                                        <Input value={floor?.roomCount} disabled
                                               className="bg-muted/50 border-transparent cursor-not-allowed"/>
                                    </FormItem>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="note"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><FileText
                                                className="h-3.5 w-3.5"/> Note</FormLabel>
                                            <FormControl><Input {...field} disabled={!isEditing}
                                                                className={!isEditing ? "bg-muted/50 border-transparent" : ""}/></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {isEditing && (
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" disabled={loading} className="gap-2">
                                            <Save className="h-4 w-4"/> Save Changes
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