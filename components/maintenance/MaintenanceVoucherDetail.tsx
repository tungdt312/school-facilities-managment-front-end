"use client"
import React, { useEffect, useState } from 'react'
import { MaintenanceVoucherResponse } from "@/dtos/maintenance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { MaintenanceStatus, MaintenanceStatusLabel } from '@/constaints/enum';
import { getMaintenanceVoucherById } from '@/services/maintenanceService';
import { toast } from 'sonner';

interface MaintenanceVoucherDetailProps {
    id: string;
}

export const MaintenanceVoucherDetail = ({ id }: MaintenanceVoucherDetailProps) => {
    const [data, setData] = useState<MaintenanceVoucherResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const voucher = await getMaintenanceVoucherById(id);
                setData(voucher);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load maintenance voucher");
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin mr-2 h-6 w-6" />
                <span>Loading maintenance voucher details...</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Maintenance voucher not found</p>
            </div>
        );
    }

    const statusColor = data.status === MaintenanceStatus.Completed ? "default" : "secondary";

    return (
        <div className="space-y-6">
            <Link href="/maintenance">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Maintenance
                </Button>
            </Link>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Main Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Voucher Information</CardTitle>
                        <CardDescription>Basic details about the maintenance voucher</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Voucher ID</p>
                            <p className="font-semibold text-lg">{data.voucherId}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Invoice Number</p>
                            <p className="font-semibold">{data.invoiceNumber}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Invoice ID</p>
                            <p className="font-semibold text-sm">{data.invoiceId}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <div>
                                <Badge variant={statusColor}>{MaintenanceStatusLabel[data.status]}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Amount Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Amount Information</CardTitle>
                        <CardDescription>Financial details of the maintenance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="font-semibold text-2xl">${data.totalAmount.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Creator Information */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Creator Information</CardTitle>
                        <CardDescription>Who created this maintenance voucher</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Created By (ID)</p>
                                <p className="font-semibold">{data.createdBy}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Created By (Name)</p>
                                <p className="font-semibold">{data.createdByName}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Created At</p>
                                <p className="font-semibold">{new Date(data.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
