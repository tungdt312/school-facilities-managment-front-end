"use client"

import React, {useEffect, useState} from 'react'
import {useFieldArray, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Calendar, CheckCircle2, FileText, Loader2, Package, Plus, Trash2, User} from 'lucide-react'
import {toast} from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {CreateBorrowRequest} from '@/dtos/borrow'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {postBorrow} from "@/services/borrowService";
import {DeviceResponse} from "@/dtos/device";
import {PageRequest} from "@/dtos/base";
import {getDevicesList} from "@/services/deviceService";

// Validation Schema
const borrowSchema = z.object({
    borrowerId: z.string().min(1, "Borrower ID is required"),
    returnDate: z.string().min(1, "Expected return date is required"),
    note: z.string().optional(),
    details: z.array(z.object({
        equipmentId: z.string().min(1, "Equipment ID is required"),
        note: z.string().optional()
    })).min(1, "At least one equipment must be added")
})
type FormValues = z.infer<typeof borrowSchema>
export const CreateBorrowVoucherDialog = () => {
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
    const form = useForm<FormValues>({
        resolver: zodResolver(borrowSchema),
        defaultValues: {
            borrowerId: '',
            note: '',
            returnDate: '',
            details: [{equipmentId: '', note: ''}]
        }
    })

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "details"
    })

    const onSubmit = async (data: CreateBorrowRequest) => {
        setLoading(true)
        try {
            // Simulated API Call
            console.log("Submitting Borrow Voucher:", data)
            const res = await postBorrow(data)
            toast.success("Borrow voucher created successfully")
            setOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Failed to create borrow voucher")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2"> Create Borrow Voucher
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Package className="h-6 w-6 text-blue-600"/>
                        New Borrow Voucher
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details to issue equipment to a borrower.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        {/* Primary Info Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="borrowerId"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5"/> Borrower ID
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="EMP-12345" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="returnDate"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5"/> Expected Return
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
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
                                    <FormLabel className="flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5"/> Note
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Reason for borrowing..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Equipment List Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-sm font-bold ">
                                    Equipment List
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({equipmentId: '', note: ''})}
                                    className="h-8 gap-1"
                                >
                                    <Plus className="h-3.5 w-3.5"/> Add Item
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id}
                                         className="flex gap-3 items-start p-3 rounded-lg border bg-slate-50/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.equipmentId`}
                                                render={({field}) => (
                                                    <FormItem className="flex-1">
                                                        <Select
                                                            onValueChange={(val) => {
                                                                field.onChange(val);
                                                                // Automatically set the equipment name for the UI
                                                                const device = devices.find(d => d.equipmentId === val);
                                                                form.setValue(`details.${index}.equipmentId`, device?.equipmentId || "");
                                                            }}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white">
                                                                    <SelectValue
                                                                        placeholder="Select existing device..."/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {/* Filter to show only available devices if needed */}
                                                                {devices.map((device) => (
                                                                    <SelectItem key={device.equipmentId}
                                                                                value={device.equipmentId}>
                                                                        <div className="flex flex-col items-start">
                                                                            <span
                                                                                className="font-medium">{device.equipmentName}</span>
                                                                            <span
                                                                                className="text-[10px] text-muted-foreground">{device.equipmentId}</span>
                                                                        </div>
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
                                                name={`details.${index}.note`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Condition/Item note" {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-red-700 hover:bg-red-50"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {form.formState.errors.details?.root && (
                                <p className="text-sm font-medium text-destructive">
                                    {form.formState.errors.details.root.message}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="pt-6 border-t">
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
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                ) : (
                                    <CheckCircle2 className="h-4 w-4"/>
                                )}
                                Create Voucher
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}