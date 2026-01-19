"use client"

import React, {useEffect, useState} from 'react'
import {AlertCircle, Calendar, ClipboardList, FileText, Hash, Loader2, MapPin, MoveRight, User} from 'lucide-react'
import {toast} from 'sonner'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {formatISODate} from '@/lib/utils'
import {TransferVoucherResponse} from "@/dtos/transfer"
import {MOCK_TRANSFER_VOUCHERS} from "@/components/mock-data/transfer-data"

interface TransferVoucherInfoCardProps {
    id: string
}

export const TransferVoucherInfoCard = ({id}: TransferVoucherInfoCardProps) => {
    const [voucher, setVoucher] = useState<TransferVoucherResponse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true)
            try {
                // Simulating API call
                await new Promise(resolve => setTimeout(resolve, 600))
                const data = MOCK_TRANSFER_VOUCHERS.find(v => v.transferId === id)
                if (data) {
                    setVoucher(data)
                }
            } catch (error) {
                toast.error("Failed to load transfer voucher details")
            } finally {
                setLoading(false)
            }
        }
        fetchDetail()
    }, [id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary"/>
                <p className="text-sm text-muted-foreground font-medium">Loading...</p>
            </div>
        )
    }

    if (!voucher) {
        return (
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4"/>
                <h3 className="text-lg font-semibold">Voucher Not Found</h3>
            </div>
        )
    }

    return (
        <Card className="shadow-lg border-none ring-1 ring-slate-200 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b bg-slate-50/50">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold tracking-tight">
                            {voucher.transferId}
                        </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Hash className="h-3.5 w-3.5"/>
                        Ref Request: <span>{voucher.requestId}</span>
                    </p>
                </div>


            </CardHeader>

            <CardContent className="pt-8 space-y-8">
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5"/>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground tracking-wider">Transfer
                                    Date</p>
                                <p className="font-medium ">{formatISODate(voucher.createdAt)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-0.5"/>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground tracking-wider">Processed By</p>
                                <p className="font-medium ">{voucher.createdByName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4"/>
                            <p className="text-sm font-medium  tracking-wider">Location Movement</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex-1 text-center">
                                <p className=" mb-1">Source Location</p>
                                <div className="flex items-center justify-center gap-2 font-semibold ">
                                    {voucher.sourceLocationId}
                                </div>
                            </div>
                            <MoveRight className="h-6 w-6 text-blue-500"/>
                            <div className="flex-1 text-center">
                                <p className="mb-1">Destination Location</p>
                                <div className="flex items-center justify-center gap-2 font-semibold ">
                                    {voucher.destinationRoomId}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Equipment List Table */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground tracking-wider flex items-center gap-2 ">
                        <ClipboardList className="h-5 w-5"/> Transferred Items ({voucher.details.length})
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
                                    <td className="px-6 py-4 font-semibold">
                                        {item.equipmentName}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 italic">
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
                        <FileText className="h-3 w-3"/>
                        This transfer voucher is a finalized record and cannot be edited.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}