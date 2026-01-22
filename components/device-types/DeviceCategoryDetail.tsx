"use client"

import { DeviceCategoryResponse } from "@/dtos/device";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeviceStatus } from "@/constaints/enum";

interface DeviceCategoryDetailProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: DeviceCategoryResponse;
    onEdit?: () => void;
}

export function DeviceCategoryDetail({ open, onOpenChange, category, onEdit }: DeviceCategoryDetailProps) {
    const getStatusBadgeVariant = (status: DeviceStatus) => {
        if (status === DeviceStatus.Available || status === DeviceStatus.Unassigned) {
            return "default";
        }
        return "secondary";
    };

    const getStatusLabel = (status: DeviceStatus) => {
        const statusMap: { [key in DeviceStatus]: string } = {
            [DeviceStatus.Unassigned]: "Unassigned",
            [DeviceStatus.Available]: "Available",
            [DeviceStatus.Borrowed]: "Borrowed",
            [DeviceStatus.UnderMaintenance]: "Under Maintenance",
            [DeviceStatus.Broken]: "Broken",
            [DeviceStatus.Lost]: "Lost",
            [DeviceStatus.Disposed]: "Disposed",
        };
        return statusMap[status] || "Unknown";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{category.equipmentCategoryName}</DialogTitle>
                    <DialogDescription>
                        Category ID: {category.equipmentCategoryId}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Category Info */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-sm mb-2">Note</h3>
                            <p className="text-sm text-muted-foreground">
                                {category.note || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Equipment List */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3">Equipment ({category.equipments?.length || 0})</h3>
                        {category.equipments && category.equipments.length > 0 ? (
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs">Equipment ID</TableHead>
                                            <TableHead className="text-xs">Name</TableHead>
                                            <TableHead className="text-xs">Location</TableHead>
                                            <TableHead className="text-xs">Status</TableHead>
                                            <TableHead className="text-xs text-right">Unit Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {category.equipments.map((equipment) => (
                                            <TableRow key={equipment.equipmentId}>
                                                <TableCell className="text-xs font-mono">
                                                    {equipment.equipmentId}
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    {equipment.equipmentName}
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    {equipment.locationName}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getStatusBadgeVariant(equipment.status)}
                                                        className="text-xs"
                                                    >
                                                        {getStatusLabel(equipment.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-right">
                                                    ${equipment.unitPrice.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No equipment found in this category
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
