"use client"

import React, { useEffect, useState } from 'react'
import {
    Calendar, User, Package, FileText,
    Check, X, Loader2, AlertCircle,
    Trash2, UserCheck, ClipboardList, Info
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LiquidateRequestResponse } from '@/dtos/liquidate'
import { VoucherStatus } from '@/constaints/enum'
import { formatISODate } from '@/lib/utils'
import { MOCK_LIQUIDATE_REQUESTS } from '@/components/mock-data/liquidates-data'

interface LiquidateRequestInfoCardProps {
    id: string
}

export const LiquidateRequestInfoCard = ({ id }: LiquidateRequestInfoCardProps) => {
    const [request, setRequest] = useState<LiquidateRequestResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    // 1. Fetch Request Details
    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true)
            try {
                // Simulating API call
                await new Promise(resolve => setTimeout(resolve, 600))
                const data = MOCK_LIQUIDATE_REQUESTS.find(r => r.requestId === id)
                if (data) {
                    setRequest(data)
                }
            } catch (error) {
                toast.error("Failed to load liquidation request")
            } finally {
                setLoading(false)
            }
        }
        fetchDetail()
    }, [id])

    // 2. Handle Approval/Rejection
    const handleUpdateStatus = async (newStatus: VoucherStatus) => {
        setUpdating(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            setRequest(prev => prev ? { ...prev, status: newStatus } : null)

            if (newStatus === VoucherStatus.Approved) {
                toast.success("Liquidation request approved")
            } else {
                toast.error("Liquidation request rejected")
            }
        } catch (error) {
            toast.error("Action failed, please try again")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-medium">Loading request details...</p>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Request Not Found</h3>
                <p className="text-muted-foreground text-sm">The liquidation request you are looking for does not exist.</p>
            </div>
        )
    }

    return (
        <Card className="shadow-lg border-none ring-1 ring-slate-200 overflow-hidden">

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

                <div className="text-right flex flex-col items-end gap-1">
                    <Badge className={
                        request.status === VoucherStatus.Approved ? "bg-emerald-500 hover:bg-emerald-600" :
                            request.status === VoucherStatus.Pending ? "bg-amber-500 hover:bg-amber-600" :
                                "bg-red-500 hover:bg-red-600"
                    }>
                        {request.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-8 space-y-8">
                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground tracking-wider">Created Date</p>
                                <p className="font-medium text-slate-900">{formatISODate(request.createdAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Submission Date</p>
                                <p >{formatISODate(request.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
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

                {/* Items to be Liquidated */}
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

                {/* Actions: ONLY FOR PENDING */}
                {request.status === VoucherStatus.Pending && (
                    <div className="flex justify-end items-center gap-4 pt-8 border-t border-slate-100">

                        <div className="flex gap-3">
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
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}