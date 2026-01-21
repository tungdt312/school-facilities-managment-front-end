"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Loader2, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { getPeriodicAuditById, deletePeriodicAudit } from '@/services/auditService';
import { AuditPeriodResponse } from '@/dtos/audit';

interface AuditPeriodDetailProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    periodId: string;
    onSuccess?: () => void;
}

export function AuditPeriodDetail({ open, onOpenChange, periodId, onSuccess }: AuditPeriodDetailProps) {
    const [data, setData] = useState<AuditPeriodResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (open && periodId) {
            fetchDetail();
        }
    }, [open, periodId]);

    const fetchDetail = async () => {
        setIsLoading(true);
        try {
            const response = await getPeriodicAuditById(periodId);
            setData(response);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load audit period details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this audit period?")) return;

        setIsDeleting(true);
        try {
            await deletePeriodicAudit(periodId);
            toast.success("Audit period deleted successfully");
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete audit period");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Audit Period Details</DialogTitle>
                    <DialogDescription>
                        View and manage audit period information
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Loading...
                    </div>
                ) : data ? (
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Audit Name</p>
                                <p className="text-base font-semibold mt-1">{data.periodicAuditName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Period ID</p>
                                <p className="text-base font-mono mt-1">{data.periodId}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                                <p className="text-base font-semibold mt-1">
                                    {new Date(data.startDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">End Date</p>
                                <p className="text-base font-semibold mt-1">
                                    {new Date(data.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Responsible Person</p>
                            <p className="text-base font-semibold mt-1">{data.responsiblePerson}</p>
                        </div>

                        <div className="bg-muted p-3 rounded-md">
                            <p className="text-xs font-medium text-muted-foreground">Duration</p>
                            <p className="text-sm mt-1">
                                {Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No data found</p>
                    </div>
                )}

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={isDeleting || isLoading}
                        onClick={handleDelete}
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}