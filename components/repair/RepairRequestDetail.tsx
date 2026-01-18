"use client"
import React, { useEffect, useState } from 'react'
import { RepairRequestResponse } from "@/dtos/repair";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { VoucherStatus } from '@/constaints/enum';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

// Mock data
const MOCK_REQUEST: RepairRequestResponse = {
    requestId: "RR001",
    createdByName: "John Doe",
    createdAt: "2024-01-15",
    note: "Projector lamp is broken and needs replacement",
    status: VoucherStatus.Pending,
    details: [
        {
            equipmentId: "EQ001",
            equipmentName: "Projector",
            note: "Lamp needs replacement"
        }
    ]
};

interface RepairRequestDetailProps {
    id: string;
}

export const RepairRequestDetail = ({ id }: RepairRequestDetailProps) => {
    const [data, setData] = useState<RepairRequestResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                setData(MOCK_REQUEST);
            } catch (error) {
                console.error(error);
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

    return (
        <div className="space-y-6">
            <Link href="/repair?tab=requests">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Requests
                </Button>
            </Link>

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
                            <div>
                                <Badge variant={getStatusColor(data.status)}>{data.status}</Badge>
                            </div>
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
        </div>
    );
}
