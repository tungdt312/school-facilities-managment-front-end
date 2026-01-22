"use client"

import React, { useEffect, useState } from 'react'
import {
    AlertCircle,
    Calendar,
    Check,
    ClipboardList,
    FileText,
    Loader2,
    MoveRight,
    MapPin,
    Package,
    User,
    UserCheck,
    X
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TransferRequestResponse } from '@/dtos/transfer'
import {VoucherStatus, VoucherStatusLabel} from '@/constaints/enum'
import { formatISODate } from '@/lib/utils'
import { MOCK_TRANSFER_REQUESTS } from '@/components/mock-data/transfer-data'
import {getImportRequestById, putImportRequestStatus} from "@/services/importService";
import {getTransferRequestById, putTransferRequestStatus} from "@/services/transferService";

interface TransferRequestInfoCardProps {
    id: string
}

export const TransferRequestInfoCard = ({ id }: TransferRequestInfoCardProps) => {
    const [request, setRequest] = useState<TransferRequestResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    const fetchDetail = async () => {
        setLoading(true)
        try {
            const res = await getTransferRequestById(id)
            setRequest(res)
        } catch (error) {
            toast.error("Failed to fetch transfer request details")
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
            const res = await putTransferRequestStatus(id, {status: newStatus})
            toast.success(`Request marked as ${VoucherStatusLabel[newStatus]}`)
        } catch (error) {
            toast.error("Update failed")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-medium">Loading...</p>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-destructive">
                <AlertCircle className="h-10 w-10 mb-2" />
                <p>Request not found</p>
            </div>
        )
    }

    return (
        <Card className="shadow-lg border-none ring-1 ring-slate-200 overflow-hidden">
            {/* Header Section - Exactly as procurement-request-info.tsx */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b bg-slate-50/50">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold tracking-tight">
                            {request.requestId}
                        </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        Requested by: <span className="font-semibold text-foreground">{request.createdByName}</span>
                    </p>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                    <Badge className={
                        request.status === VoucherStatus.Approved ? "bg-emerald-500 hover:bg-emerald-600" :
                            request.status === VoucherStatus.Pending ? "bg-amber-500 hover:bg-amber-600" :
                                "bg-red-500 hover:bg-red-600"
                    }>
                        {VoucherStatusLabel[request.status]}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                {/* Location Transfer Visual Block */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex-1 text-center">
                        <p className=" mb-1">Source Location</p>
                        <div className="flex items-center justify-center gap-2 font-semibold ">
                            {request.sourceLocationName}
                        </div>
                    </div>
                    <div className="px-4">
                        <MoveRight className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1 text-center">
                        <p className="mb-1">Destination Location</p>
                        <div className="flex items-center justify-center gap-2 font-semibold ">
                            {request.destinationLocationName}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground tracking-wider">Created Date</p>
                                <p className="font-medium text-slate-900">{formatISODate(request.createdAt)}</p>
                            </div>
                        </div>
                        {/* Note block - Styled exactly as requested */}
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

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" /> Equipment Disposal List ({request.details.length})
                        </h3>
                        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">Equipment Name</th>
                                    <th className="px-4 py-2 text-left font-medium">ID</th>
                                    <th className="px-4 py-2 text-left font-medium">Condition Note</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {request.details.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold">{item.equipmentName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.equipmentId}
                                        </td>
                                        <td className="px-6 py-4 ">
                                            {item.note || "Standard disposal"}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Exactly as procurement-request-info.tsx */}
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
                                {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                Approve Transfer
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}