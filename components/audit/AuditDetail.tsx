"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ArrowLeft, Loader, Trash2, Plus, Edit2} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import { getInventoryAuditById, deleteAuditDetail, getAuditDetailsByAuditId, createAuditDetail, updateAuditDetail } from "@/services/auditService";
import { InventoryAuditResponse, AuditDetailResponse, CreateAuditDetailRequest } from "@/dtos/audit";
import { AuditStatus, AuditStatusLabel, DeviceStatus, DeviceStatusLabel } from "@/constaints/enum";
import { getDevicesList } from "@/services/deviceService";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

// Convert condition string from API to DeviceStatus enum
const convertConditionToEnum = (condition: any): DeviceStatus => {
    if (typeof condition === 'number') return condition as DeviceStatus;
    
    const conditionStringMap: Record<string, DeviceStatus> = {
        'Unassigned': DeviceStatus.Unassigned,
        'Available': DeviceStatus.Available,
        'Borrowed': DeviceStatus.Borrowed,
        'UnderMaintenance': DeviceStatus.UnderMaintenance,
        'Broken': DeviceStatus.Broken,
        'Lost': DeviceStatus.Lost,
        'Disposed': DeviceStatus.Disposed,
    };
    
    return conditionStringMap[condition as string] || DeviceStatus.Available;
};

export const AuditDetail = ({ id }: { id: string }) => {
    const [data, setData] = useState<AuditDetail | null>(null);
    const [details, setDetails] = useState<AuditDetailResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isDeletingDetail, setIsDeletingDetail] = useState<string | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingDetail, setEditingDetail] = useState<AuditDetailResponse | null>(null);
    const [formData, setFormData] = useState<CreateAuditDetailRequest>({
        equipmentId: "",
        condition: DeviceStatus.Available,
        note: "",
    });
    
    // Equipment state
    const [equipment, setEquipment] = useState<any[]>([]);
    const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const auditData = await getInventoryAuditById(id);
                console.log("📊 Audit Data:", auditData);
                setData(auditData as AuditDetail);
                
                // Fetch details separately
                await fetchDetails(id);
            } catch (error) {
                console.error("Failed to fetch audit detail:", error);
                toast.error("Failed to load audit details");
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Fetch equipment when create or edit dialog opens
    useEffect(() => {
        if (isCreateDialogOpen || isEditDialogOpen) {
            fetchEquipment();
        }
    }, [isCreateDialogOpen, isEditDialogOpen]);

    const fetchEquipment = async () => {
        try {
            setIsLoadingEquipment(true);
            const response = await getDevicesList({ page: 1, size: 100 });
            setEquipment(response.content || []);
        } catch (error) {
            console.error("Failed to fetch equipment:", error);
            toast.error("Failed to load equipment");
            setEquipment([]);
        } finally {
            setIsLoadingEquipment(false);
        }
    };

    const fetchDetails = async (auditId: string) => {
        try {
            setIsLoadingDetails(true);
            const detailsData = await getAuditDetailsByAuditId(auditId);
            console.log("📋 Details:", detailsData);
            // Convert condition strings back to enum numbers
            const convertedDetails = detailsData.map(detail => ({
                ...detail,
                condition: convertConditionToEnum(detail.condition),
            }));
            setDetails(convertedDetails);
        } catch (error) {
            console.error("Failed to fetch audit details:", error);
            toast.error("Failed to load equipment details");
            setDetails([]);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleAddDetail = async () => {
        if (!formData.equipmentId) {
            toast.error("Please select equipment");
            return;
        }

        try {
            setIsSubmitting(true);
            const newDetail = await createAuditDetail(id, formData.equipmentId, {
                condition: formData.condition,
                note: formData.note,
            });
            toast.success("Equipment added successfully");
            
            // Refresh details from server
            await fetchDetails(id);
            
            // Reset form and close dialog
            setFormData({
                equipmentId: "",
                condition: DeviceStatus.Available,
                note: "",
            });
            setIsCreateDialogOpen(false);
        } catch (error) {
            toast.error("Failed to add equipment");
            console.error("Error adding audit detail:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDetail = async (equipmentId: string) => {
        try {
            setIsDeletingDetail(equipmentId);
            console.log("🗑️ Deleting detail - equipmentId:", equipmentId);
            
            // Find the detail to get equipmentId
            const detail = details.find(d => d.equipmentId === equipmentId);
            if (!detail) {
                toast.error("Equipment detail not found");
                console.error("❌ Detail not found for equipmentId:", equipmentId);
                console.log("Available details:", details.map(d => ({ detailId: d.detailId, equipmentId: d.equipmentId, name: d.equipmentName })));
                return;
            }
            
            console.log("🗑️ Found detail:", {
                detailId: detail.detailId,
                equipmentId: detail.equipmentId,
                equipmentName: detail.equipmentName,
            });
            console.log("🗑️ Calling deleteAuditDetail with auditId:", id, "equipmentId:", detail.equipmentId);
            
            await deleteAuditDetail(id, detail.equipmentId);
            toast.success("Equipment detail deleted successfully");
            
            // Refetch details to ensure consistency with backend
            await fetchDetails(id);
        } catch (error) {
            console.error("Error deleting audit detail:", error);
            const errorMsg = error instanceof Error ? error.message : "Failed to delete equipment detail";
            toast.error(errorMsg);
        } finally {
            setIsDeletingDetail(null);
        }
    };

    const handleEditDetail = (detail: AuditDetailResponse) => {
        setEditingDetail(detail);
        setFormData({
            equipmentId: detail.equipmentId,
            condition: detail.condition,
            note: detail.note || "",
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateDetail = async () => {
        if (!editingDetail) {
            toast.error("No detail selected for update");
            return;
        }

        try {
            setIsSubmitting(true);
            console.log("✏️ Updating detail:", editingDetail.detailId);
            
            const updatedDetail = await updateAuditDetail(id, editingDetail.equipmentId, {
                condition: formData.condition,
                note: formData.note,
            });
            toast.success("Equipment detail updated successfully");
            
            // Convert condition string back to enum
            const convertedDetail = {
                ...updatedDetail,
                condition: convertConditionToEnum(updatedDetail.condition),
            };
            
            // Update local state
            setDetails(
                details.map(d =>
                    d.detailId === editingDetail.detailId ? convertedDetail : d
                )
            );
            
            // Reset form and close dialog
            setFormData({
                equipmentId: "",
                condition: DeviceStatus.Available,
                note: "",
            });
            setEditingDetail(null);
            setIsEditDialogOpen(false);
        } catch (error) {
            toast.error("Failed to update equipment detail");
            console.error("Error updating audit detail:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Equipment Details</CardTitle>
                                <CardDescription>
                                    {details.length} item(s) audited
                                </CardDescription>
                            </div>
                            <Button size="sm" className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4" />
                                Add Equipment
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoadingDetails ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader className="h-5 w-5 animate-spin mr-2" />
                                <span className="text-muted-foreground">Loading equipment details...</span>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Equipment Name</TableHead>
                                        <TableHead>Condition</TableHead>
                                        <TableHead>Note</TableHead>
                                        <TableHead className="w-12">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {details && details.length > 0 ? (
                                        details.map((detail, index) => (
                                            <TableRow key={detail.detailId || detail.equipmentId || `detail-${index}`}>
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
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                                            onClick={() => handleEditDetail(detail)}
                                                            disabled={isDeletingDetail === detail.detailId}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteDetail(detail.equipmentId)}
                                                            disabled={isDeletingDetail === detail.detailId}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                No equipment details found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create Audit Detail Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Add Equipment Detail</DialogTitle>
                        <DialogDescription>
                            Add a new equipment to this audit
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="equipmentId">Equipment *</Label>
                            <Select
                                value={formData.equipmentId}
                                onValueChange={(value) => setFormData({ ...formData, equipmentId: value })}
                                disabled={isSubmitting || isLoadingEquipment}
                            >
                                <SelectTrigger id="equipmentId">
                                    <SelectValue placeholder={isLoadingEquipment ? "Loading equipment..." : "Select equipment"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {equipment.map((item) => (
                                        <SelectItem key={item.equipmentId} value={item.equipmentId}>
                                            {item.equipmentName} ({item.equipmentId})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="condition">Condition *</Label>
                            <Select
                                value={(formData.condition ?? DeviceStatus.Available).toString()}
                                onValueChange={(value) => setFormData({ ...formData, condition: parseInt(value) as DeviceStatus })}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id="condition">
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={DeviceStatus.Available.toString()}>Available</SelectItem>
                                    <SelectItem value={DeviceStatus.Borrowed.toString()}>Borrowed</SelectItem>
                                    <SelectItem value={DeviceStatus.UnderMaintenance.toString()}>Under Maintenance</SelectItem>
                                    <SelectItem value={DeviceStatus.Broken.toString()}>Broken</SelectItem>
                                    <SelectItem value={DeviceStatus.Lost.toString()}>Lost</SelectItem>
                                    <SelectItem value={DeviceStatus.Disposed.toString()}>Disposed</SelectItem>
                                    <SelectItem value={DeviceStatus.Unassigned.toString()}>Unassigned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="note">Note</Label>
                            <Input
                                id="note"
                                placeholder="Add a note (optional)"
                                value={formData.note || ""}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddDetail}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Adding..." : "Add Equipment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Audit Detail Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Edit Equipment Detail</DialogTitle>
                        <DialogDescription>
                            Update the equipment details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-equipmentId">Equipment</Label>
                            <Select
                                value={formData.equipmentId}
                                onValueChange={(value) => setFormData({ ...formData, equipmentId: value })}
                                disabled={isSubmitting || isLoadingEquipment}
                            >
                                <SelectTrigger id="edit-equipmentId">
                                    <SelectValue placeholder={isLoadingEquipment ? "Loading equipment..." : "Select equipment"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {equipment.map((item) => (
                                        <SelectItem key={item.equipmentId} value={item.equipmentId}>
                                            {item.equipmentName} ({item.equipmentId})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-condition">Condition *</Label>
                            <Select
                                value={(formData.condition ?? DeviceStatus.Available).toString()}
                                onValueChange={(value) => setFormData({ ...formData, condition: parseInt(value) as DeviceStatus })}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id="edit-condition">
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={DeviceStatus.Available.toString()}>Available</SelectItem>
                                    <SelectItem value={DeviceStatus.Borrowed.toString()}>Borrowed</SelectItem>
                                    <SelectItem value={DeviceStatus.UnderMaintenance.toString()}>Under Maintenance</SelectItem>
                                    <SelectItem value={DeviceStatus.Broken.toString()}>Broken</SelectItem>
                                    <SelectItem value={DeviceStatus.Lost.toString()}>Lost</SelectItem>
                                    <SelectItem value={DeviceStatus.Disposed.toString()}>Disposed</SelectItem>
                                    <SelectItem value={DeviceStatus.Unassigned.toString()}>Unassigned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-note">Note</Label>
                            <Input
                                id="edit-note"
                                placeholder="Add a note (optional)"
                                value={formData.note || ""}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditDialogOpen(false);
                                setEditingDetail(null);
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateDetail}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Equipment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};