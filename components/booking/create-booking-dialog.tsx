"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Plus, Calendar, Clock, DoorOpen, FileText,
    Loader2, CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CreateBookingRequest } from '@/dtos/booking'
import { MOCK_ROOMS_FLAT } from "@/components/mock-data/areas-data"

// Validation Schema
const bookingSchema = z.object({
    roomId: z.string().min(1, "Please select a room"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    purpose: z.string()
        .min(1, "Purpose is required")
        .max(500, "Purpose cannot exceed 500 characters"),
}).refine((data) => {
    return new Date(data.endTime) > new Date(data.startTime);
}, {
    message: "End time must be after start time",
    path: ["endTime"],
});

type FormValues = z.infer<typeof bookingSchema>

export const CreateBookingVoucherDialog = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            roomId: '',
            startTime: '',
            endTime: '',
            purpose: '',
        }
    })

    const onSubmit = async (data: CreateBookingRequest) => {
        setLoading(true)
        try {
            // Simulated API Call
            console.log("Submitting Booking Request:", data)
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast.success("Room booking created successfully")
            setOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Failed to create booking")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 ">
                    New Room Booking
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <DoorOpen className="h-6 w-6 text-primary" />
                        Create Booking
                    </DialogTitle>
                    <DialogDescription>
                        Schedule a room for meetings or events.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        {/* Room Selection from Database */}
                        <FormField
                            control={form.control}
                            name="roomId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <DoorOpen className="h-3.5 w-3.5" /> Select Room
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose an available room..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {MOCK_ROOMS_FLAT.map((room) => (
                                                <SelectItem key={room.roomId} value={room.roomId}>
                                                    {room.roomName} (Floor {room.floorName})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Start Time */}
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5" /> Start Date & Time
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* End Time */}
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5" /> End Date & Time
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Purpose */}
                        <FormField
                            control={form.control}
                            name="purpose"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5" /> Booking Purpose
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the reason for this booking..."
                                            className="resize-none h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-6 border-t gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="gap-2 px-8">
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                )}
                                Confirm Booking
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}