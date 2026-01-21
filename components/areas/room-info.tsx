"use client"

import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Activity, DoorOpen, Layers, Loader2, Pencil, Save, Users, X} from 'lucide-react'
import {toast} from 'sonner'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {RoomResponse} from "@/dtos/building"
import {MOCK_BUILDINGS, MOCK_ROOM_TYPES} from "@/components/mock-data/areas-data"
import Link from "next/link";
import {getFloorById, getRoomById, putFloor, putRoom} from "@/services/areaService";
import {BookingStatus, RoomStatus, RoomStatusLabel, UserRole, UserRoleLabel} from "@/constaints/enum";

const roomSchema = z.object({
    roomName: z.string().min(1, "Room name is required"),
    roomTypeId: z.string().min(1, "Type is required"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    status: z.number().min(0, "Status is required"),
})

type RoomFormValues = z.infer<typeof roomSchema>

export function RoomInfoCard({id}: { id: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [room, setRoom] = useState<RoomResponse | undefined>(undefined)

    const form = useForm<RoomFormValues>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            roomName: "",
            roomTypeId: "",
            capacity: 1,
            status: RoomStatus.Unavailable,
        },
    })

    useEffect(() => {
        const fetchRoom = async () => {
            setLoading(true)
            // Tìm room từ Mock Data
            try {
                const res = await getRoomById(id)
                setRoom(res)
                form.reset({
                    roomName: res.roomName,
                    roomTypeId: res.roomTypeId,
                    capacity: res.capacity,
                    status: res.status ,
                })
            }catch (error) {
                toast.error("Failed to load room")
            } finally {
                setLoading(false)
            }
        }
        fetchRoom()
    }, [id, form])

    const onSubmit = async (values: RoomFormValues) => {
        setLoading(true)
        try {
            const res = await putRoom(values, id)
            toast.success("Room updated successfully")
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to update room")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2
        className="animate-spin h-8 w-8 text-primary"/></div>
    if (!room) return <div className="p-4 text-center">Room not found</div>

    return (
        <Card className="w-full max-w-4xl mx-auto border-muted/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <CardTitle className=" font-semibold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary"/> Room Detail [{id}]
                </CardTitle>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Pencil className="h-4 w-4 mr-2"/> Edit
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => {
                            form.reset();
                            setIsEditing(false)
                        }} className="text-destructive">
                            <X className="h-4 w-4 mr-1"/> Cancel
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col gap-8 md:flex-row">
                            {/* Left Visual Section */}
                            <div
                                className="flex flex-col items-center gap-4 md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
                                <div
                                    className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/5 shadow-sm">
                                    <DoorOpen className="h-12 w-12 text-primary"/>
                                </div>
                                <div className="text-center">
                                    <span
                                        className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">
                                        {room.roomTypeName}
                                    </span>
                                    <h3 className="font-bold text-xl mt-1">{form.getValues("roomName")}</h3>
                                    <Link href={`/areas/floor/${room?.floorId}`}
                                          className="text-xs text-muted-foreground font-medium bg-primary/5 px-2 py-0.5 rounded-full inline-block">
                                        {room?.floorName}
                                    </Link>
                                </div>
                            </div>

                            {/* Right Form Fields */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="roomName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><DoorOpen
                                                    className="h-3.5 w-3.5"/> Room Name</FormLabel>
                                                <FormControl><Input {...field} disabled={!isEditing}
                                                                    className={!isEditing ? "bg-muted/50" : ""}/></FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="roomTypeId"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Room Type</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}
                                                        disabled={!isEditing}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {MOCK_ROOM_TYPES.map((type) => (
                                                            <SelectItem key={type.roomTypeId} value={type.roomTypeId}>
                                                                {type.typeName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="capacity"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><Users
                                                    className="h-3.5 w-3.5"/> Capacity</FormLabel>
                                                <FormControl><Input type="number" {...field} disabled={!isEditing}
                                                                    className={!isEditing ? "bg-muted/50" : ""}/></FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><Activity
                                                    className="h-3.5 w-3.5"/> Status</FormLabel>
                                                <Select onValueChange={(val) => field.onChange(Number(val))}  value={field.value?.toString()}
                                                        disabled={!isEditing}>
                                                    <FormControl><SelectTrigger
                                                        className={!isEditing ? "bg-muted/50" : ""}><SelectValue/></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {Object.values(RoomStatus)
                                                            .filter((v) => typeof v === "number") // Only numeric values
                                                            .map((statusValue) => (
                                                                <SelectItem
                                                                    key={statusValue}
                                                                    value={statusValue.toString()}
                                                                >
                                                                    {RoomStatusLabel[statusValue as number]}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {isEditing && (
                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" disabled={loading} className="gap-2 px-6">
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                                <Save className="h-4 w-4"/>}
                                            Save Changes
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