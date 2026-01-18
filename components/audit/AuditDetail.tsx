"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ArrowLeft, Loader} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

export interface AuditDetail {
    auditId: string;
    periodName: string;
    locationName: string;
    locationType: string;
    auditorId: string;
    auditorName: string;
    status: "Pending" | "Completed" | "In Progress";
    auditDate: string;
    totalDevices: number;
    checkedDevices: number;
    details: {
        detailId: string;
        equipmentName: string;
        condition: string;
        note: string;
    }[];
}

const MOCK_AUDIT_DETAILS: Record<string, AuditDetail> = {
    IA001: {
        auditId: "IA001",
        periodName: "Monthly Audit - Jan 2026",
        locationName: "Building A",
        locationType: "Building",
        auditorId: "A001",
        auditorName: "John Nguyen",
        status: "Completed",
        auditDate: "2026-01-15",
        totalDevices: 50,
        checkedDevices: 50,
        details: [
            {
                detailId: "AD001",
                equipmentName: "Computer 1",
                condition: "Available",
                note: "In good condition",
            },
            {
                detailId: "AD002",
                equipmentName: "Projector 1",
                condition: "Borrowed",
                note: "Currently used in Room 201",
            },
            {
                detailId: "AD003",
                equipmentName: "Printer 1",
                condition: "UnderMaintenance",
                note: "Toner cartridge replacement",
            },
        ],
    },
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Completed":
            return "bg-green-100 text-green-800";
        case "In Progress":
            return "bg-blue-100 text-blue-800";
        case "Pending":
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getConditionBadge = (condition: string) => {
    const conditionColors: Record<string, string> = {
        Available: "bg-green-100 text-green-800",
        Borrowed: "bg-blue-100 text-blue-800",
        UnderMaintenance: "bg-yellow-100 text-yellow-800",
        Broken: "bg-red-100 text-red-800",
        Lost: "bg-red-200 text-red-900",
        Disposed: "bg-gray-300 text-gray-800",
        Unassigned: "bg-gray-100 text-gray-800",
    };
    return conditionColors[condition] || "bg-gray-100 text-gray-800";
};

export const AuditDetail = ({ id }: { id: string }) => {
    const [data, setData] = useState<AuditDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            const auditData = MOCK_AUDIT_DETAILS[id];
            setData(auditData || null);
            setIsLoading(false);
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
                                <CardTitle>Audit {data.auditId}</CardTitle>
                                <CardDescription>{data.periodName}</CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(data.status)} border-0`}>
                                {data.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">{data.locationName}</p>
                                <p className="text-xs text-muted-foreground">{data.locationType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Auditor</p>
                                <p className="font-medium">{data.auditorName}</p>
                                <p className="text-xs text-muted-foreground">ID: {data.auditorId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Audit Date</p>
                                <p className="font-medium">
                                    {new Date(data.auditDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Progress</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                        {data.checkedDevices}/{data.totalDevices}
                                    </span>
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500"
                                            style={{
                                                width: `${(data.checkedDevices / data.totalDevices) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Equipment Details</CardTitle>
                        <CardDescription>
                            {data.details.length} item(s) audited
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
                                {data.details.length > 0 ? (
                                    data.details.map((detail) => (
                                        <TableRow key={detail.detailId}>
                                            <TableCell className="font-medium">
                                                {detail.equipmentName}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getConditionBadge(detail.condition)} border-0`}>
                                                    {detail.condition}
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
