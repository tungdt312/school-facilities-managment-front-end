"use client"
import React, { useEffect, useState } from 'react'
import { MaintenanceRequestResponse } from "@/dtos/maintenance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { VoucherStatus, VoucherStatusLabel } from '@/constaints/enum';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getMaintenanceRequestById, updateMaintenanceRequestStatus } from '@/services/maintenanceService';
import { toast } from 'sonner';
import { CreateMaintenanceVoucherDialog } from './CreateMaintenanceVoucherDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getMe } from '@/services/authService';

interface MaintenanceRequestDetailProps {
    id: string;
}

export const MaintenanceRequestDetail = ({ id }: MaintenanceRequestDetailProps) => {
    const [data, setData] = useState<MaintenanceRequestResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingVoucher, setIsCreatingVoucher] = useState(false);
    const [isCreateVoucherDialogOpen, setIsCreateVoucherDialogOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const request = await getMaintenanceRequestById(id);
                setData(request);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load maintenance request");
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
            await updateMaintenanceRequestStatus(data.requestId, {
                status: Number(newStatus) as VoucherStatus,
                approvedBy: user.userId,
            });
            toast.success("Status updated successfully");
            // Reload the page to get updated data
            window.location.reload();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this maintenance request?")) {
            return;
        }
        
        try {
            // TODO: Implement delete API call
            toast.success("Request deleted successfully");
            // Navigate back to requests list
            window.location.href = "/maintenance?tab=requests";
        } catch (error) {
            console.error("Error deleting request:", error);
            toast.error("Failed to delete maintenance request");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin mr-2 h-6 w-6" />
                <span>Loading maintenance request details...</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Maintenance request not found</p>
            </div>
        );
    }

    const getStatusColor = (status: VoucherStatus) => {
        switch (status) {
            case VoucherStatus.Pending:
                return "bg-yellow-100 text-yellow-800";
            case VoucherStatus.Approved:
                return "bg-green-100 text-green-800";
            case VoucherStatus.Rejected:
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/maintenance?tab=requests">
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
                        <CardDescription>Basic details about the maintenance request</CardDescription>
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
                        <CardTitle>Creator Information</CardTitle>
                        <CardDescription>Who submitted this request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Created By (ID)</p>
                            <p className="font-semibold">{data.createdBy}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Created By (Name)</p>
                            <p className="font-semibold">{data.createdByName}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Note */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Request Note</CardTitle>
                        <CardDescription>Additional information about this request</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed">{data.note}</p>
                    </CardContent>
                </Card>

                {/* Equipment Details */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Equipment Details</CardTitle>
                        <CardDescription>Equipments that need maintenance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Equipment ID</TableHead>
                                        <TableHead>Equipment Name</TableHead>
                                        <TableHead>Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.details && data.details.length > 0 ? (
                                        data.details.map((detail, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-muted-foreground text-sm">{detail.equipmentId}</TableCell>
                                                <TableCell className="font-medium">{detail.equipmentName}</TableCell>
                                                <TableCell className="text-muted-foreground">{detail.description}</TableCell>
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
            {data && (
                <CreateMaintenanceVoucherDialog
                    open={isCreateVoucherDialogOpen}
                    onOpenChange={setIsCreateVoucherDialogOpen}
                    requestId={data.requestId}
                    onSuccess={() => {
                        toast.success("Voucher created successfully");
                        window.location.href = "/maintenance?tab=requests";
                    }}
                />
            )}
        </div>
    );
}
