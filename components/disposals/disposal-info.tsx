"use client"

import React, { useEffect, useState } from 'react'
import {
    Calendar, User, Package, FileText,
    Loader2, AlertCircle, Hash,
    Receipt, Landmark, DollarSign, ClipboardList,
    History
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LiquidateVoucherResponse } from '@/dtos/liquidate'
import { formatISODate, formatNumber } from '@/lib/utils'
import { MOCK_LIQUIDATE_VOUCHERS } from '@/components/mock-data/liquidates-data'
import {getLiquidateVoucherById} from "@/services/disposalService";

interface LiquidateVoucherInfoCardProps {
    id: string
}

export const LiquidateVoucherInfoCard = ({ id }: LiquidateVoucherInfoCardProps) => {
    const [voucher, setVoucher] = useState<LiquidateVoucherResponse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true)
            try {
                // Simulating API call
                const res = await getLiquidateVoucherById(id)
                setVoucher(res)
            } catch (error) {
                toast.error("Failed to load liquidation voucher details")
            } finally {
                setLoading(false)
            }
        }
        fetchDetail()
    }, [id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-medium">Loading voucher data...</p>
            </div>
        )
    }

    if (!voucher) {
        return (
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Voucher Not Found</h3>
                <p className="text-muted-foreground text-sm">The requested liquidation voucher does not exist.</p>
            </div>
        )
    }

    return (
        <Card className="shadow-lg border-none ring-1 ring-slate-200 overflow-hidden">
            {/* Top Accent Bar (Grey/Slate for Disposal/Liquidation) */}

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b bg-slate-50/50">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold tracking-tight">
                            {voucher.liquidateId}
                        </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Hash className="h-3.5 w-3.5" />
                        Ref Request: <span className="font-medium ">{voucher.requestId}</span>
                    </p>
                </div>
            </CardHeader>

            <CardContent className="pt-8 space-y-8">
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Transaction Info */}
                    <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                            <Receipt className="h-4 w-4" />
                            <p className=" text-sm font-medium text-muted-foreground">Transaction Details</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Invoice Number</p>
                            <p className="font-bold text-slate-900">{voucher.invoiceNumber}</p>
                        </div>
                        <div>
                            <p className="ext-muted-foreground">Total Recovered Amount</p>
                            <p className="font-bold text-emerald-600 text-xl">
                                ${formatNumber(voucher.totalAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Unit Info */}
                    <div className="space-y-4 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                            <Landmark className="h-4 w-4" />
                            <p className="text-sm font-medium text-muted-foreground">Purchasing Unit</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Unit Name</p>
                            <p className="font-bold ">{voucher.unitName}</p>
                            <p className="text-muted-foreground">ID: {voucher.unitId}</p>
                        </div>
                    </div>

                    {/* Creator Info */}
                    <div className="space-y-4 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                            <User className="h-4 w-4" />
                            <p className="text-sm font-medium text-muted-foreground">Processed By</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Employee Name</p>
                            <p className="font-bold ">{voucher.createdByName}</p>
                            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatISODate(voucher.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Equipment List */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <ClipboardList className="h-5 w-5" /> Disposed Equipment ({voucher.details.length})
                    </h3>

                    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium">Equipment ID</th>
                                <th className="px-4 py-2 text-left font-medium">Name</th>
                                <th className="px-4 py-2 text-left font-medium">Note</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {voucher.details.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {item.equipmentId}
                                    </td>
                                    <td className="px-6 py-4 font-semibold ">
                                        {item.equipmentName}
                                    </td>
                                    <td className="px-6 py-4 ">
                                        {item.note || "No specific note"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer status message */}
                <div className="pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <FileText className="h-3 w-3" />
                        This liquidation voucher is a finalized record and cannot be edited.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}