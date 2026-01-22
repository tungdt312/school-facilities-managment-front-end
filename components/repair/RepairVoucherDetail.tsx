"use client"
import React, { useEffect, useState } from 'react'
import { RepairVoucherResponse } from "@/dtos/repair";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { MaintenanceStatus, MaintenanceStatusLabel } from '@/constaints/enum';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getRepairVoucherById } from '@/services/repairService';
import { toast } from 'sonner';

interface RepairVoucherDetailProps {
    id: string;
}

export const RepairVoucherDetail = ({ id }: RepairVoucherDetailProps) => {
    const [data, setData] = useState<RepairVoucherResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const voucherData = await getRepairVoucherById(id);
                setData(voucherData);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load repair voucher");
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
                <span>Loading repair voucher details...</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Repair voucher not found</p>
            </div>
        );
    }

    const statusColor = data.status === MaintenanceStatus.Completed ? "default" : "secondary";

    return (
        <div className="space-y-6">
            <Link href="/repair">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Repair
                </Button>
            </Link>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Main Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Voucher Information</CardTitle>
                        <CardDescription>Basic details about the repair voucher</CardDescription>
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
                            <p className="text-sm text-muted-foreground">Status</p>
                            <div>
                                <Badge variant={statusColor}>{MaintenanceStatusLabel[data.status]}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Amount & Provider Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                        <CardDescription>Financial and provider details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="font-semibold text-2xl">${data.totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Service Provider</p>
                            <p className="font-semibold">{data.providerName}</p>
                        </div>
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
        </div>
    );
}
