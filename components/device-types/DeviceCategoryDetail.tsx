"use client"

import { DeviceCategoryResponse } from "@/dtos/device";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeviceStatus } from "@/constaints/enum";
import { CriteriaResponse } from "@/dtos/criteria";
import { getCriterias, createCriteria, updateCriteria, deleteCriteria } from "@/services/criteriaService";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface DeviceCategoryDetailProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: DeviceCategoryResponse;
    onEdit?: () => void;
}

interface CriteriaEditing {
    criteriaId?: string;
    content: string;
}

export function DeviceCategoryDetail({ open, onOpenChange, category, onEdit }: DeviceCategoryDetailProps) {
    const [criterias, setCriterias] = useState<CriteriaResponse[]>([]);
    const [isLoadingCriteria, setIsLoadingCriteria] = useState(false);
    const [isEditingCriteria, setIsEditingCriteria] = useState<CriteriaEditing | null>(null);
    const [isSavingCriteria, setIsSavingCriteria] = useState(false);

    // Reset state khi dialog đóng
    useEffect(() => {
        if (!open) {
            setCriterias([]);
            setIsEditingCriteria(null);
            setIsLoadingCriteria(false);
        }
    }, [open]);

    // Fetch criteria khi dialog mở và category thay đổi
    useEffect(() => {
        if (open && category?.equipmentCategoryId) {
            // Clear old data trước khi fetch
            setCriterias([]);
            setIsEditingCriteria(null);
            fetchCriterias();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, category?.equipmentCategoryId]); // ← Thêm equipmentCategoryId vào dependency

    const fetchCriterias = async () => {
        if (!category?.equipmentCategoryId) return;

        try {
            setIsLoadingCriteria(true);
            const response = await getCriterias({
                page: 1,
                size: 100,
            });
            // Filter client-side
            const filtered = (response.content || []).filter(
                c => c.categoryId === category.equipmentCategoryId
            );
        
            setCriterias(filtered);
        } catch (error) {
            console.error("Failed to fetch criterias:", error);
            toast.error("Failed to load criteria");
            setCriterias([]); // ← Set empty nếu lỗi
        } finally {
            setIsLoadingCriteria(false);
        }
    };

    const handleAddCriteria = () => {
        setIsEditingCriteria({ content: "" });
    };

    const handleEditCriteria = (criteria: CriteriaResponse) => {
        setIsEditingCriteria({
            criteriaId: criteria.criteriaId,
            content: criteria.content
        });
    };

    const handleSaveCriteria = async () => {
        if (!isEditingCriteria?.content.trim()) {
            toast.error("Criteria content cannot be empty");
            return;
        }

        try {
            setIsSavingCriteria(true);

            if (isEditingCriteria.criteriaId) {
                // Update existing criteria
                await updateCriteria(isEditingCriteria.criteriaId, {
                    categoryId: category.equipmentCategoryId,
                    content: isEditingCriteria.content
                });
                toast.success("Criteria updated successfully");
            } else {
                // Create new criteria
                await createCriteria({
                    categoryId: category.equipmentCategoryId,
                    content: isEditingCriteria.content
                });
                toast.success("Criteria created successfully");
            }

            setIsEditingCriteria(null);
            await fetchCriterias(); // Refresh list
        } catch (error) {
            console.error("Failed to save criteria:", error);
            toast.error("Failed to save criteria");
        } finally {
            setIsSavingCriteria(false);
        }
    };

    const handleDeleteCriteria = async (criteriaId: string) => {
        if (!confirm("Are you sure you want to delete this criteria?")) {
            return;
        }

        try {
            await deleteCriteria(criteriaId);
            toast.success("Criteria deleted successfully");
            await fetchCriterias(); // Refresh list
        } catch (error) {
            console.error("Failed to delete criteria:", error);
            toast.error("Failed to delete criteria");
        }
    };

    const handleCancelEdit = () => {
        setIsEditingCriteria(null);
    };

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

                    {/* Criteria List */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-sm">Criteria ({criterias.length})</h3>
                            {!isEditingCriteria && (
                                <Button
                                    size="sm"
                                    onClick={handleAddCriteria}
                                    className="h-8 gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </Button>
                            )}
                        </div>

                        {isEditingCriteria && (
                            <div className="border rounded-md p-3 mb-3 bg-muted/30">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Enter criteria content..."
                                        value={isEditingCriteria.content}
                                        onChange={(e) => setIsEditingCriteria({
                                            ...isEditingCriteria,
                                            content: e.target.value
                                        })}
                                        disabled={isSavingCriteria}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancelEdit}
                                            disabled={isSavingCriteria}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleSaveCriteria}
                                            disabled={isSavingCriteria}
                                        >
                                            {isSavingCriteria ? "Saving..." : "Save"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLoadingCriteria ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Loading criteria...
                            </p>
                        ) : criterias.length > 0 ? (
                            <div className="space-y-2">
                                {criterias.map((criteria) => (
                                    <div
                                        key={criteria.criteriaId}
                                        className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                                    >
                                        <p className="text-sm">{criteria.content}</p>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditCriteria(criteria)}
                                                disabled={isEditingCriteria !== null}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteCriteria(criteria.criteriaId)}
                                                disabled={isEditingCriteria !== null}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No criteria defined for this category
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