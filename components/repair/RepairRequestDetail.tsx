"use client"
import React, { useEffect, useState } from 'react'
import { RepairRequestResponse } from "@/dtos/repair";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { VoucherStatus, VoucherStatusLabel } from '@/constaints/enum';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getRepairRequestById, updateRepairRequestStatus } from '@/services/repairService';
import { toast } from 'sonner';
import { CreateRepairVoucherDialog } from './CreateRepairVoucherDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getMe } from '@/services/authService';

interface RepairRequestDetailProps {
    id: string;
}

export const RepairRequestDetail = ({ id }: RepairRequestDetailProps) => {
    const [data, setData] = useState<RepairRequestResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateVoucherDialogOpen, setIsCreateVoucherDialogOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const requestData = await getRepairRequestById(id);
                setData(requestData);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load repair request");
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        if (!data) return;

        setIsUpdatingStatus(true);
        try {
            const user = await getMe();
            await updateRepairRequestStatus(data.requestId, {
                status: Number(newStatus) as VoucherStatus,
                approvedBy: user.userId,
            });
            toast.success("Status updated successfully");
            // Reload to get updated data
            window.location.reload();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const getStatusColor = (status: VoucherStatus) => {
        switch (status) {
            case VoucherStatus.Approved:
                return "default";
            case VoucherStatus.Rejected:
                return "destructive";
            default:
                return "secondary";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin mr-2 h-6 w-6" />
                <span>Loading repair request details...</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Repair request not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/repair?tab=requests">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Requests
                    </Button>
                </Link>
                <div className="flex gap-2">
                    {data.status === VoucherStatus.Approved && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsCreateVoucherDialogOpen(true)}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Invoice
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Request Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Request Information</CardTitle>
                        <CardDescription>Basic details about the repair request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Request ID</p>
                            <p className="font-semibold text-lg">{data.requestId}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Select 
                                value={String(data.status)} 
                                onValueChange={handleStatusChange}
                                disabled={isUpdatingStatus}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={String(VoucherStatus.Pending)}>
                                        {VoucherStatusLabel[VoucherStatus.Pending]}
                                    </SelectItem>
                                    <SelectItem value={String(VoucherStatus.Approved)}>
                                        {VoucherStatusLabel[VoucherStatus.Approved]}
                                    </SelectItem>
                                    <SelectItem value={String(VoucherStatus.Rejected)}>
                                        {VoucherStatusLabel[VoucherStatus.Rejected]}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="font-semibold">{new Date(data.createdAt).toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Creator Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Requester Information</CardTitle>
                        <CardDescription>Who submitted this repair request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Created By</p>
                            <p className="font-semibold">{data.createdByName}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Note */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Request Note</CardTitle>
                        <CardDescription>Details about the repair needed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed">{data.note}</p>
                    </CardContent>
                </Card>

                {/* Equipment Details */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Equipment Details</CardTitle>
                        <CardDescription>Equipments that need repair</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Equipment ID</TableHead>
                                        <TableHead>Equipment Name</TableHead>
                                        <TableHead>Note</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.details && data.details.length > 0 ? (
                                        data.details.map((detail, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-muted-foreground text-sm">{detail.equipmentId}</TableCell>
                                                <TableCell className="font-medium">{detail.equipmentName}</TableCell>
                                                <TableCell className="text-muted-foreground">{detail.note || "-"}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                No equipment details
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialogs */}
            <CreateRepairVoucherDialog
                open={isCreateVoucherDialogOpen}
                onOpenChange={setIsCreateVoucherDialogOpen}
                requestId={data.requestId}
                onSuccess={() => {
                    toast.success("Voucher created successfully");
                    window.location.href = "/repair?tab=vouchers";
                }}
            />
        </div>
    );
}
