"use client"

import React, {useEffect, useState} from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Plus, Trash2, FileText, Loader2,
    CheckCircle2, ClipboardList, Package, Search
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
import { CreateLiquidateRequestRequest } from '@/dtos/liquidate'
import { MOCK_DEVICES } from "@/components/mock-data/devices-data"
import {getImportRequestsList, postImportRequest} from "@/services/importService";
import {DeviceResponse} from "@/dtos/device";
import {PageRequest} from "@/dtos/base";
import {DeviceStatus, VoucherStatus} from "@/constaints/enum";
import {getDevicesList} from "@/services/deviceService";

const liquidateRequestSchema = z.object({
    note: z.string().optional(),
    details: z.array(z.object({
        equipmentId: z.string().min(1, "Please select equipment"),
        note: z.string().optional()
    })).min(1, "At least one item must be selected for liquidation")
})

export const CreateLiquidateRequestDialog = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [devices, setDevices] = useState<DeviceResponse[]>([])

    const fetchDevices = async () => {
        try {
            const req: PageRequest = {
                page: 1,
                size: 100,
            }
            const res = await getDevicesList(req)
            setDevices(res.content)
        } catch (e) {
            console.error(e);
            toast.error("Failed to load devices data");
            setDevices([]);
        }
    }

    useEffect(() => {
        fetchDevices()
    }, []);
    const form = useForm<z.infer<typeof liquidateRequestSchema>>({
        resolver: zodResolver(liquidateRequestSchema),
        defaultValues: {
            note: '',
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
            const res = await postImportRequest(data)
            toast.success("Liquidation request submitted")
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
                <Button className="gap-2">
                    Request Liquidation
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        New Liquidation Request
                    </DialogTitle>
                    <DialogDescription>Select equipment that is no longer fit for use.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5" /> Reason for Liquidation
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Broken, obsolete, end of life..." className="resize-none h-20" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-sm font-bold ">Equipment to Dispose
                                </h3>
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ equipmentId: '', note: '' })} className="h-8 gap-1">
                                    <Plus className="h-3.5 w-3.5" /> Add Item
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
                                                                {devices.map((d) => (
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
                            <Button type="submit" disabled={loading} className="gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                Submit Request
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}