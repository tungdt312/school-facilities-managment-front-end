"use client"

import React, {useEffect, useState} from 'react'
import {useFieldArray, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {CheckCircle2, Hash, Loader2, Plus, Receipt, Trash2} from 'lucide-react'
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ImportRequestResponse} from "@/dtos/import";
import {PageRequest} from "@/dtos/base";
import {VoucherStatus} from "@/constaints/enum";
import {getImportRequestsList} from "@/services/importService";
import {getLiquidateRequestsList, postLiquidateVoucher} from "@/services/disposalService";
import {CreateLiquidateVoucherRequest, LiquidateRequestResponse} from "@/dtos/liquidate";
import {DeviceResponse} from "@/dtos/device";
import {getDevicesList} from "@/services/deviceService";
import {getInvoices} from "@/services/invoiceService";
import {InvoiceResponse} from "@/dtos/other";

const liquidateVoucherSchema = z.object({
    requestId: z.string().min(1, "Reference Request ID is required"),
    invoiceId: z.string().min(1, "Disposal/Invoice ID is required"),
    details: z.array(z.object({
        equipmentId: z.string().min(1, "Equipment ID is required"),
        note: z.string().optional()
    })).min(1, "At least one item must be included")
})

export const CreateLiquidateVoucherDialog = ({defaultRequestId}: { defaultRequestId?: string }) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [requests, setRequests] = useState<LiquidateRequestResponse[]>([])
    const [devices, setDevices] = useState<DeviceResponse[]>([])
    const [invoices, setInvoices] = useState<InvoiceResponse[]>([])
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
    const fetchRequests = async () => {
        try {
            const req: PageRequest = {
                page: 1,
                size: 100,
                filter: `Status==${VoucherStatus.Approved}`,
            }
            const res = await getLiquidateRequestsList(req)
            setRequests(res.content)
        } catch (e) {
            console.error(e);
            toast.error("Failed to load disposal request data");
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
    const form = useForm<z.infer<typeof liquidateVoucherSchema>>({
        resolver: zodResolver(liquidateVoucherSchema),
        defaultValues: {
            requestId: defaultRequestId || '',
            invoiceId: '',
            details: [{equipmentId: '', note: ''}]
        }
    })
    const selectedRequestId = form.watch("requestId");
    const selectedRequest = requests.find(r => r.requestId === selectedRequestId);
    useEffect(() => {
        if (selectedRequest && selectedRequest.details) {
            // Ánh xạ các thiết bị từ phiếu yêu cầu sang định dạng của Voucher
            const itemsFromRequest = selectedRequest.details.map(item => ({
                equipmentId: item.equipmentId,
                note: "" // Để trống để người dùng nhập lý do thanh lý cụ thể (ví dụ: "Đã bán sắt vụn")
            }));

            form.setValue("details", itemsFromRequest);
        }
    }, [selectedRequestId, selectedRequest, form]);
    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "details"
    })

    const onSubmit = async (data: CreateLiquidateVoucherRequest) => {
        setLoading(true)
        try {
            const res = await postLiquidateVoucher(data)
            toast.success("Liquidation voucher created successfully")
            setOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Finalization failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">Create Disposal Voucher
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Receipt className="h-6 w-6 text-slate-700"/>
                        Finalize Disposal
                    </DialogTitle>
                    <DialogDescription>Record the final disposal or sale receipt of the equipment.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
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

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-sm font-bold ">Disposal Items</h3>
                                <Button type="button" variant="outline" size="sm"
                                        onClick={() => append({equipmentId: '', note: ''})} className="h-8 gap-1">
                                    <Plus className="h-3.5 w-3.5"/> Add Item
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id}
                                         className="grid grid-cols-12 gap-3 items-start p-4 rounded-xl border bg-slate-50/50">
                                        <div className="col-span-12 md:col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.equipmentId`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Select Device</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full md:w-[200px] flex justify-between items-center">
                                                                    <div className="truncate text-left flex-1 mr-2">
                                                                        <SelectValue placeholder={selectedRequestId ? "Choose devices from request..." : "Please choose a request first"} />
                                                                    </div>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {/* Lọc: Chỉ hiển thị các thiết bị nằm trong phiếu yêu cầu đã chọn */}
                                                                {selectedRequest?.details?.map((d) => (
                                                                    <SelectItem key={d.equipmentId} value={d.equipmentId}>
                                                                        {d.equipmentName} ({d.equipmentId})
                                                                    </SelectItem>
                                                                ))}
                                                                {!selectedRequest && (
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
                                        <div className="col-span-11 md:col-span-6">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.note`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Note</FormLabel>
                                                        <FormControl><Input
                                                            placeholder="Sold for parts / Scrapped" {...field} /></FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-end pt-7">
                                            <Button type="button" variant="ghost" size="icon"
                                                    className="text-destructive" onClick={() => remove(index)}
                                                    disabled={fields.length === 1}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="pt-6 border-t">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="gap-2 ">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                    <CheckCircle2 className="h-4 w-4"/>}
                                Finalize Voucher
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}