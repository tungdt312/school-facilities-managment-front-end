"use client"

import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Calendar, Clock, User, DoorOpen, FileText,
    Check, X, Pencil, Save, Info, Loader2, AlertCircle, Activity
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoomBookingResponse } from '@/dtos/booking'
import {BookingStatus, BookingStatusLabel, DeviceStatus, DeviceStatusLabel} from '@/constaints/enum'
import { formatISODate } from '@/lib/utils'
import {MOCK_DEVICES} from "@/components/mock-data/devices-data";
import {MOCK_ROOM_BOOKINGS} from "@/components/mock-data/booking-data";
import {getDeviceById} from "@/services/deviceService";
import {approveBooking, getBookingById, updateBooking} from "@/services/bookingService";

const bookingSchema = z.object({
    status: z.number().min(0, "Status is required"),
})
type BookingInfo = z.infer<typeof bookingSchema>
interface BookingInfoCardProps {
    id: string,
}

export const BookingInfoCard = ({ id }: BookingInfoCardProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [booking, setBooking] = useState<RoomBookingResponse | undefined>(undefined)
    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await getBookingById(id)
            form.reset({
                ...res
            })
            setBooking(res)
        } catch (e) {
            toast.error("Failed to fetch booking info")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [id]);

    const form = useForm<BookingInfo>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            status: BookingStatus.Pending
        }
    })
    if (!booking) { return }
    const handleQuickAction = async (newStatus: BookingStatus) => {
        setLoading(true)
        try {
            const res = await updateBooking(id, {status: newStatus})
            toast.success(`Booking ${BookingStatusLabel[newStatus].toLowerCase()} successfully`)
        } catch (error) {
            toast.error("Failed to update status")
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (values: z.infer<typeof bookingSchema>) => {
        setLoading(true)
        try {
            setIsEditing(false)
            const res = await updateBooking(id, values)
            toast.success("Status updated successfully")
        } catch (error) {
            toast.error("Update failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        {booking.bookingId}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Created on {formatISODate(booking.createdAt)}</p>
                </div>

                {!isEditing && (
                    <Badge className={
                        booking.status === BookingStatus.Approved ? "bg-emerald-500" :
                            booking.status === BookingStatus.Pending ? "bg-amber-500" :
                                booking.status === BookingStatus.Rejected ? "bg-red-500" : "bg-slate-500"
                    }>
                        {BookingStatusLabel[booking.status]}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Room & Borrower */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <DoorOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Room Information</p>
                                        <p className="font-semibold text-lg">{booking.roomName}</p>
                                        <p className="text-xs text-muted-foreground">ID: {booking.roomId}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Borrower</p>
                                        <p className="font-semibold">{booking.borrowerName}</p>
                                        <p className="text-xs text-muted-foreground">ID: {booking.borrowerId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Time & Status Edit */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Schedule</p>
                                        <div className="text-sm">
                                            <span className="text-emerald-600 font-medium">Start:</span> {formatISODate(booking.startTime)}
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-rose-600 font-medium">End:</span> {formatISODate(booking.endTime)}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Field - ONLY EDITABLE FIELD */}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><Activity
                                                className="h-3.5 w-3.5"/> Status</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value?.toString()} disabled={!isEditing}>
                                                <FormControl><SelectTrigger className={!isEditing ? "bg-muted/50" : ""}><SelectValue/></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {Object.values(DeviceStatus).map(s => <SelectItem key={s}
                                                                                                      value={s.toString()}>{BookingStatusLabel[s as number]}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Purpose & Notes */}
                        <div className="bg-muted/30  rounded-lg space-y-3">
                            <div className="flex gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="text-sm">
                                    <span className="font-semibold">Purpose:</span> {booking.purpose}
                                </div>
                            </div>
                            {booking.note && (
                                <div className="flex gap-2 border-t pt-2 mt-2">
                                    <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <div className="text-sm italic">
                                        <span className="font-semibold not-italic">Note:</span> {booking.note}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons Logic */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            {booking.status === BookingStatus.Pending && !isEditing ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleQuickAction(BookingStatus.Rejected)}
                                        disabled={loading}
                                    >
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                    <Button
                                        type="button"
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => handleQuickAction(BookingStatus.Approved)}
                                        disabled={loading}
                                    >
                                        <Check className="mr-2 h-4 w-4" /> Approve Booking
                                    </Button>
                                </>
                            ) : isEditing ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading} className="gap-2">
                                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        <Save className="h-4 w-4" /> Save Status
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Pencil className="h-4 w-4" /> Edit Status
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}