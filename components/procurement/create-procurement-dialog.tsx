"use client"

import React, {useEffect, useState} from 'react'
import {useFieldArray, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {CheckCircle2, DollarSign, Hash, Loader2, Plus, Receipt, ShoppingCart, Trash2} from 'lucide-react'
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {CreateImportVoucherRequest, ImportRequestResponse} from '@/dtos/import'
import {MOCK_IMPORT_REQUESTS} from "@/components/mock-data/import-data"
import {getImportRequestsList, postImportVoucher} from "@/services/importService";
import {PageRequest} from "@/dtos/base";
import {getSortString} from "@/lib/utils";
import {VoucherStatus} from "@/constaints/enum";
import {InvoiceResponse} from "@/dtos/other";
import {getInvoices} from "@/services/invoiceService";

// Validation Schema
const importVoucherSchema = z.object({
    requestId: z.string().min(1, "Reference Request ID is required"),
    invoiceId: z.string().min(1, "Invoice ID is required"),

    details: z.array(z.object({
        equipmentName: z.string().min(1, "Equipment name is required"),
        quantity: z.number().min(0, "Price must be at least 0"),
        note: z.string().optional()
    })).min(1, "At least one item must be imported")
})
type FormValues = z.infer<typeof importVoucherSchema>
export const CreateImportVoucherDialog = ({requestId}:{requestId?: string}) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [requests, setRequests] = useState<ImportRequestResponse[]>([])
    const [invoices, setInvoices] = useState<InvoiceResponse[]>([])
    const fetchRequests = async () => {
        try {
            const req: PageRequest = {
                page: 1,
                size: 100,
                filter: `Status==${VoucherStatus.Approved}`,
            }
            const res = await getImportRequestsList(req)
            setRequests(res.content)
        } catch (e) {
            console.error(e);
            toast.error("Failed to load procurement request data");
            setRequests([]);
        }
    }
    const fetchInvoices = async () => {
        try {
            const req: PageRequest = {
                page: 1,
                size: 100,
            }
            const res = await getInvoices(req)
            setInvoices(res.content)
        } catch (e) {
            console.error(e);
            toast.error("Failed to load invoice data");
            setRequests([]);
        }
    }

    useEffect(() => {
        fetchRequests()
        fetchInvoices()
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(importVoucherSchema),
        defaultValues: {
            requestId: requestId || '',
            invoiceId: '',
            details: [{equipmentName: '', quantity: 0, note: ''}]
        }
    })
    const selectedRequestId = form.watch("requestId");
    const selectedRequest = requests.find(r => r.requestId === selectedRequestId);
    useEffect(() => {
        if (selectedRequest && selectedRequest.details) {
            // Tự động map danh sách thiết bị từ phiếu yêu cầu sang phiếu nhập
            const initialDetails = selectedRequest.details.map(item => ({
                equipmentName: item.equipmentName,
                quantity: item.quantity, // Giả định nhập đủ số lượng đã yêu cầu
                note: ""
            }));

            form.setValue("details", initialDetails);
        }
    }, [selectedRequestId, selectedRequest, form]);
    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "details"
    })

    const onSubmit = async (data: CreateImportVoucherRequest) => {
        setLoading(true)
        try {
           const res = await postImportVoucher(data)

            toast.success("Import voucher created successfully")
            setOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Failed to create import voucher")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">Create Import Voucher
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-primary"/>
                        New Import Voucher
                    </DialogTitle>
                    <DialogDescription>
                        Generate a voucher to finalize the receipt of purchased equipment.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        {/* Reference & Invoice Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="requestId"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Hash className="h-3.5 w-3.5"/> Reference Request
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full md:w-[200px] flex justify-between items-center">
                                                    <div className="truncate text-left flex-1 mr-2">
                                                        <SelectValue placeholder="Select Request ID" />
                                                    </div>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {requests.map((req) => (
                                                    <SelectItem key={req.requestId} value={req.requestId}>
                                                        <span className={"text-muted-foreground tetx-xs"}>{req.requestId}</span>
                                                        <span>({req.createdByName})</span>
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
                                name="invoiceId"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Receipt className="h-3.5 w-3.5"/> Invoice ID / Number
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full md:w-[200px] flex justify-between items-center">
                                                    <div className="truncate text-left flex-1 mr-2">
                                                        <SelectValue placeholder="Select Invoice ID" />
                                                    </div>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {invoices.map((req) => (
                                                    <SelectItem key={req.invoiceId} value={req.invoiceId}>
                                                        <span className={"text-muted-foreground tetx-xs"}>{req.invoiceId}</span>
                                                        <span>({req.totalAmount})</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Items Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-sm font-bold ">
                                    Purchased Equipment Details
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({equipmentName: '', quantity: 0, note: ''})}
                                    className="h-8 gap-1 "
                                >
                                    <Plus className="h-3.5 w-3.5"/> Add Equipment
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id}
                                         className="grid grid-cols-12 gap-3 items-start p-4 rounded-xl border bg-slate-50/50">
                                        <div className="col-span-12 md:col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.equipmentName`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            Devices
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full md:w-[170px]">
                                                                    <div className="truncate text-left flex-1 mr-2">
                                                                        <SelectValue placeholder={selectedRequestId ? "Choose devices from request..." : "Please choose a request first"} />
                                                                    </div>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {selectedRequest ? (
                                                                    selectedRequest.details.map((detail) => (
                                                                        <SelectItem key={detail.detailId} value={detail.equipmentName}>
                                                                            {detail.equipmentName} (SL: {detail.quantity})
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <div className="p-2 text-xs text-center text-muted-foreground">
                                                                        Please choose a request first
                                                                    </div>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-6 md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.quantity`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Quantity</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input {...field} type="number" onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-5 md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.note`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Item
                                                            Note</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Serial, etc." {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-end pt-7">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-red-50"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                            <Button type="submit" disabled={loading}
                                    className="gap-2 px-8">
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                ) : (
                                    <CheckCircle2 className="h-4 w-4"/>
                                )}
                                Finalize Import
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}