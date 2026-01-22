"use client"

import React, {useEffect, useState} from 'react'
import * as z from 'zod'
import {
    AlertCircle,
    Calendar,
    Check,
    ClipboardList,
    FileText,
    Loader2,
    ShoppingCart,
    User,
    UserCheck,
    X
} from 'lucide-react'
import {toast} from 'sonner'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {ImportRequestResponse} from '@/dtos/import'
import {VoucherStatus} from '@/constaints/enum'
import {formatISODate} from '@/lib/utils'
import {MOCK_IMPORT_REQUESTS} from '@/components/mock-data/import-data'
import {getImportRequestById, putImportRequestStatus} from "@/services/importService";

interface ImportRequestInfoCardProps {
    id: string
}

export const ImportRequestInfoCard = ({ id }: ImportRequestInfoCardProps) => {
    const [request, setRequest] = useState<ImportRequestResponse | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    const fetchDetail = async () => {
        setLoading(true)
        try {
            const res = await getImportRequestById(id)
            setRequest(res)
        } catch (error) {
            toast.error("Failed to fetch import request details")
        } finally {
            setLoading(false)
        }
    }
    // 2. Fetch data và reset form
    useEffect(() => {
        fetchDetail()
    }, [id])

    const handleUpdateStatus = async (newStatus: VoucherStatus) => {
        setUpdating(true)
        try {
            const res = await putImportRequestStatus(id, {status: newStatus})
            setIsEditing(false)
            toast.success(`Request marked as ${newStatus}`)
        } catch (error) {
            toast.error("Update failed")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading request details...</p>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="p-8 text-center border rounded-lg bg-muted/20">
                <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
                <p className="font-medium">Import request not found</p>
            </div>
        )
    }

    return (
        <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        {request.requestId}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        Requested by: <span className="font-semibold text-foreground">{request.createdByName}</span>
                    </p>
                </div>

                {!isEditing && (
                    <Badge className={
                        request.status === VoucherStatus.Approved ? "bg-emerald-500 hover:bg-emerald-600" :
                            request.status === VoucherStatus.Pending ? "bg-amber-500 hover:bg-amber-600" :
                                "bg-red-500 hover:bg-red-600"
                    }>
                        {request.status}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cột trái: Thông tin người yêu cầu & Người duyệt */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground tracking-wider">Created Date</p>
                                        <p className="font-medium text-slate-900">{formatISODate(request.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Requester Info</p>
                                        <p className="font-semibold text-base">{request.createdByName}</p>
                                        <p className="text-xs text-muted-foreground italic">ID: {request.createdBy}</p>
                                    </div>
                                </div>


                            </div>

                            {/* Cột phải: Trạng thái & Chỉnh sửa */}
                            <div className="space-y-6">
                                {request.approvedByName && (
                                    <div className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-md border border-emerald-100">
                                        <UserCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-emerald-800">Approver Info</p>
                                            <p className="font-semibold text-emerald-900">{request.approvedByName}</p>
                                            <p className="text-sm text-emerald-700 ">
                                                Approved at: {request.approvedAt ? formatISODate(request.approvedAt) : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                            <FileText className="h-4 w-4" /> Note
                                        </p>
                                        <p className="eading-relaxed">
                                            {request.note || "No specific reason provided for this disposal request."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách thiết bị nhập (Bảng chi tiết) */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <ClipboardList className="h-4 w-4" /> Requested Items ({request.details.length})
                            </p>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 border-b ">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Equipment Name</th>
                                        <th className="px-4 py-2 text-center font-medium w-24">Quantity</th>
                                        <th className="px-4 py-2 text-left font-medium">Note</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                    {request.details.map((item) => (
                                        <tr key={item.detailId} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3 font-medium">{item.equipmentName}</td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant="secondary">{item.quantity}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.note || "---"}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>



                        {/* Nút thao tác */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            {request.status === VoucherStatus.Pending && (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleUpdateStatus(VoucherStatus.Rejected)}
                                        disabled={updating}
                                    >
                                        <X className="mr-2 h-4 w-4" /> Reject Request
                                    </Button>
                                    <Button
                                        type="button"
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => handleUpdateStatus(VoucherStatus.Approved)}
                                        disabled={updating}
                                    >
                                        <Check className="mr-2 h-4 w-4" /> Approve Import
                                    </Button>
                                </>
                            )}
                        </div>
            </CardContent>
        </Card>
    )
}