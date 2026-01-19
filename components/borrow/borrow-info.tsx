"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Calendar, Clock, User, Package, FileText,
    Check, X, Pencil, Save, Info, Loader2, AlertCircle, Hash
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BorrowVoucherResponse } from '@/dtos/borrow'
import { BorrowStatus } from '@/constaints/enum'
import { formatISODate } from '@/lib/utils'
import { MOCK_BORROW_VOUCHERS } from '@/components/mock-data/borrow-data'

const borrowSchema = z.object({
    status: z.string().min(0, "Status is required"),
})

type BorrowFormValues = z.infer<typeof borrowSchema>

interface BorrowInfoCardProps {
    id: string
}

export const BorrowInfoCard = ({ id }: BorrowInfoCardProps) => {
    const [borrow, setBorrow] = useState<BorrowVoucherResponse | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    // 1. Khai báo Hook useForm ở cấp cao nhất
    const form = useForm<BorrowFormValues>({
        resolver: zodResolver(borrowSchema),
        defaultValues: {
            status: BorrowStatus.Pending
        }
    })

    // 2. Fetch dữ liệu dựa trên ID
    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true)
            try {
                // Giả lập API call
                await new Promise(resolve => setTimeout(resolve, 600))
                const data = MOCK_BORROW_VOUCHERS.find(b => b.borrowId === id)
                if (data) {
                    setBorrow(data)
                    // 3. Reset form khi có dữ liệu mới
                    form.reset({ status: data.status })
                }
            } catch (error) {
                toast.error("Failed to fetch borrow details")
            } finally {
                setLoading(false)
            }
        }
        fetchDetail()
    }, [id, form])

    const handleUpdateStatus = async (newStatus: BorrowStatus) => {
        setUpdating(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            setBorrow(prev => prev ? { ...prev, status: newStatus } : null)
            form.setValue("status", newStatus)
            setIsEditing(false)
            toast.success(`Status updated to ${newStatus}`)
        } catch (error) {
            toast.error("Update failed")
        } finally {
            setUpdating(false)
        }
    }

    const onSubmit = (values: BorrowFormValues) => {
        handleUpdateStatus(values.status as BorrowStatus)
    }

    // 4. Return sớm cho trạng thái Loading sau khi các Hook đã được khai báo
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading borrow voucher...</p>
            </div>
        )
    }

    if (!borrow) {
        return (
            <div className="p-8 text-center border rounded-lg bg-muted/20">
                <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
                <p className="font-medium">Borrow voucher not found</p>
            </div>
        )
    }

    return (
        <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Hash className="h-5 w-5 text-primary" />
                        {borrow.borrowId}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Requested by {borrow.createdByName} on {formatISODate(borrow.createdAt)}</p>
                </div>

                {!isEditing && (
                    <Badge className={
                        borrow.status === BorrowStatus.Returned ? "bg-emerald-500" :
                            borrow.status === BorrowStatus.Borrowing ? "bg-blue-500" :
                                borrow.status === BorrowStatus.Pending ? "bg-amber-500" :
                                    borrow.status === BorrowStatus.Approved ? "bg-purple-500" : "bg-slate-500"
                    }>
                        {borrow.status}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cột trái: Thông tin người mượn & Thiết bị */}
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Borrower</p>
                                        <p className="font-semibold text-lg">{borrow.borrowerName}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Package className="h-4 w-4" /> Equipment List ({borrow.details.length})
                                    </p>
                                    <div className="grid gap-2">
                                        {borrow.details.map((item, index) => (
                                            <div key={index} className="text-sm p-2 rounded border bg-muted/10">
                                                <div className="font-medium">{item.equipmentName}</div>
                                                <div className="text-xs text-muted-foreground">ID: {item.equipmentId}</div>
                                                {item.note && <div className="text-xs italic text-amber-600 mt-1">Note: {item.note}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải: Thời gian & Trạng thái */}
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Schedule</p>
                                        <div className="text-sm mt-1">
                                            <span className="text-muted-foreground">Borrow Date:</span> {formatISODate(borrow.createdAt)}
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-amber-600 font-medium">Expected Return:</span> {borrow.returnDate ? formatISODate(borrow.returnDate) : "N/A"}
                                        </div>
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-muted-foreground">
                                                <Info className="h-3.5 w-3.5" /> Change Status
                                            </FormLabel>
                                            <Select
                                                disabled={!isEditing || updating}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className={!isEditing ? "bg-muted/30 border-none shadow-none focus:ring-0" : "border-primary"}>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(BorrowStatus).map((status) => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Note chung của phiếu */}
                        {borrow.note && (
                            <div className="flex gap-2 border-t pt-2 mt-2">
                                <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="text-sm italic">
                                    <span className="font-semibold not-italic">Note:</span> {borrow.note}
                                </div>
                            </div>
                        )}

                        {/* Logic nút bấm */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            {borrow.status === BorrowStatus.Pending && !isEditing ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleUpdateStatus(BorrowStatus.Rejected)}
                                        disabled={updating}
                                    >
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                    <Button
                                        type="button"
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => handleUpdateStatus(BorrowStatus.Approved)}
                                        disabled={updating}
                                    >
                                        <Check className="mr-2 h-4 w-4" /> Approve Borrowing
                                    </Button>
                                </>
                            ) : isEditing ? (
                                <>
                                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={updating} className="gap-2">
                                        {updating && <Loader2 className="h-4 w-4 animate-spin" />}
                                        <Save className="h-4 w-4" /> Save Status
                                    </Button>
                                </>
                            ) : (
                                <Button type="button" variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
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