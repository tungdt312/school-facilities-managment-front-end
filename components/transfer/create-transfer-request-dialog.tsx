"use client"

import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Plus, Trash2, FileText, Loader2,
    CheckCircle2, ClipboardList, MoveRight, MapPin
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateTransferRequestRequest } from '@/dtos/transfer'
import { LocationType } from '@/constaints/enum'
import { MOCK_ROOMS_FLAT } from "@/components/mock-data/areas-data"
import { MOCK_DEVICES } from "@/components/mock-data/devices-data"

const transferRequestSchema = z.object({
    sourceLocationId: z.string().min(1, "Source is required"),
    sourceLocationType: z.nativeEnum(LocationType),
    destinationRoomId: z.string().min(1, "Destination is required"),
    destinationLocationType: z.nativeEnum(LocationType),
    note: z.string().optional(),
    details: z.array(z.object({
        equipmentId: z.string().min(1, "Please select equipment"),
        note: z.string().optional()
    })).min(1, "At least one item must be selected")
}).refine(data => data.sourceLocationId !== data.destinationRoomId, {
    message: "Source and Destination cannot be the same",
    path: ["destinationRoomId"]
})

export const CreateTransferRequestDialog = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof transferRequestSchema>>({
        resolver: zodResolver(transferRequestSchema),
        defaultValues: {
            sourceLocationType: LocationType.Room,
            destinationLocationType: LocationType.Room,
            details: [{ equipmentId: '', note: '' }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "details"
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Transfer request created successfully")
            setOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Failed to submit request")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 ">Create Transfer Request
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        New Transfer Request
                    </DialogTitle>
                    <DialogDescription>Relocate equipment from one room to another.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        {/* Location Selection Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <FormField
                                control={form.control}
                                name="sourceLocationId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-slate-600">Source Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="bg-white w-full"><SelectValue placeholder="From..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {MOCK_ROOMS_FLAT.map(room => (
                                                    <SelectItem key={room.roomId} value={room.roomId}>{room.roomName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destinationRoomId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-slate-600">Destination Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="bg-white w-full"><SelectValue placeholder="To..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {MOCK_ROOMS_FLAT.map(room => (
                                                    <SelectItem key={room.roomId} value={room.roomId}>{room.roomName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> Transfer Note</FormLabel>
                                    <FormControl><Textarea placeholder="Reason for transfer..." className="resize-none h-20" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Equipment Items */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-sm font-bold ">Equipment to Transfer</h3>
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ equipmentId: '', note: '' })} className="h-8 gap-1">
                                    <Plus className="h-3.5 w-3.5" /> Add Equipment
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-3 items-start p-4 rounded-xl border bg-slate-50/50">
                                        <div className="col-span-12 md:col-span-6">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.equipmentId`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Select Device</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Search equipment..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {MOCK_DEVICES.map((d) => (
                                                                    <SelectItem key={d.equipmentId} value={d.equipmentId}>
                                                                        {d.equipmentName} ({d.equipmentId})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-11 md:col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.note`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Note</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Damage details..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-end pt-7">
                                            <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)} disabled={fields.length === 1}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="pt-6 border-t">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="gap-2 ">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                Submit Transfer Request
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}