"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ArrowLeft, Loader} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import { getInventoryAuditById } from "@/services/auditService";
import { InventoryAuditResponse } from "@/dtos/audit";
import { AuditStatus, AuditStatusLabel, DeviceStatus, DeviceStatusLabel } from "@/constaints/enum";

export interface AuditDetail extends InventoryAuditResponse {
    locationName: string;
}

const getStatusColor = (status: AuditStatus | number) => {
    switch (status) {
        case AuditStatus.Completed:
            return "bg-green-100 text-green-800";
        case AuditStatus.Confirmed:
            return "bg-blue-100 text-blue-800";
        case AuditStatus.Pending:
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getStatusLabel = (status: AuditStatus | number): string => {
    const statusMap: Record<number, string> = {
        [AuditStatus.Pending]: "Pending",
        [AuditStatus.Completed]: "Completed",
        [AuditStatus.Confirmed]: "Confirmed",
    };
    return statusMap[status as number] || "Unknown";
};

const getConditionBadge = (condition: DeviceStatus | number) => {
    const conditionColors: Record<number, string> = {
        [DeviceStatus.Available]: "bg-green-100 text-green-800",
        [DeviceStatus.Borrowed]: "bg-blue-100 text-blue-800",
        [DeviceStatus.UnderMaintenance]: "bg-yellow-100 text-yellow-800",
        [DeviceStatus.Broken]: "bg-red-100 text-red-800",
        [DeviceStatus.Lost]: "bg-red-200 text-red-900",
        [DeviceStatus.Disposed]: "bg-gray-300 text-gray-800",
        [DeviceStatus.Unassigned]: "bg-gray-100 text-gray-800",
    };
    return conditionColors[condition as number] || "bg-gray-100 text-gray-800";
};

const getConditionLabel = (condition: DeviceStatus | number): string => {
    const conditionMap: Record<number, string> = {
        [DeviceStatus.Available]: "Available",
        [DeviceStatus.Borrowed]: "Borrowed",
        [DeviceStatus.UnderMaintenance]: "Under Maintenance",
        [DeviceStatus.Broken]: "Broken",
        [DeviceStatus.Lost]: "Lost",
        [DeviceStatus.Disposed]: "Disposed",
        [DeviceStatus.Unassigned]: "Unassigned",
    };
    return conditionMap[condition as number] || "Unknown";
};

export const AuditDetail = ({ id }: { id: string }) => {
    const [data, setData] = useState<AuditDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const auditData = await getInventoryAuditById(id);
                setData(auditData as AuditDetail);
            } catch (error) {
                console.error("Failed to fetch audit detail:", error);
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
                <Loader className="h-6 w-6 animate-spin mr-2" />
                <span>Loading audit details...</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Audit not found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Link href="/audit">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Audits
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {/* Audit Info Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle>{data.auditName}</CardTitle>
                                <CardDescription>{data.locationName}</CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(data.status)} border-0`}>
                                {getStatusLabel(data.status)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Audit Name</p>
                                <p className="font-medium">{data.auditName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">{data.locationName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Auditor</p>
                                <p className="font-medium">{data.auditorFullName || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Audit Date</p>
                                <p className="font-medium">{new Date(data.auditDate).toLocaleDateString() || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Periodic Audit</p>
                                <p className="font-medium">{data.periodicAuditName || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Note</p>
                                <p className="font-medium">{data.note || "-"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Equipment Details</CardTitle>
                        <CardDescription>
                            {data.details?.length || 0} item(s) audited
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Equipment Name</TableHead>
                                    <TableHead>Condition</TableHead>
                                    <TableHead>Note</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.details && data.details.length > 0 ? (
                                    data.details.map((detail) => (
                                        <TableRow key={detail.detailId}>
                                            <TableCell className="font-medium">
                                                {detail.equipmentName}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getConditionBadge(detail.condition)} border-0`}>
                                                    {getConditionLabel(detail.condition)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {detail.note || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No equipment details found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};