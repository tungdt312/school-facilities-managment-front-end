"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, X } from "lucide-react";
import { FundSourceResponse } from "@/dtos/other";
import { getFundSourceById } from "@/services/fund-sourceService";
import { Skeleton } from "@/components/ui/skeleton";

interface FundSourceDetailProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sourceId: string;
}

export function FundSourceDetail({ open, onOpenChange, sourceId }: FundSourceDetailProps) {
    const [fundSource, setFundSource] = useState<FundSourceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && sourceId) {
            fetchFundSourceDetail();
        }
    }, [open, sourceId]);

    const fetchFundSourceDetail = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getFundSourceById(sourceId);
            setFundSource(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch fund source details");
            setFundSource(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setFundSource(null);
            setError(null);
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Fund Source Details</DialogTitle>
                    <DialogDescription>
                        View detailed information about the fund source
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    </div>
                ) : fundSource ? (
                    <div className="space-y-6 py-4">
                        {/* Source ID */}
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-muted-foreground">
                                Source ID
                            </label>
                            <div className="text-base font-mono bg-muted px-3 py-2 rounded-md">
                                {fundSource.sourceId}
                            </div>
                        </div>

                        {/* Source Name */}
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-muted-foreground">
                                Source Name
                            </label>
                            <div className="text-base font-medium">
                                {fundSource.sourceName}
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-muted-foreground">
                                Amount
                            </label>
                            <div className="text-lg font-bold text-green-600">
                                {(fundSource.amount).toLocaleString('vi-VN', { 
                                    style: 'currency', 
                                    currency: 'VND' 
                                })}
                            </div>
                        </div>

                        {/* Note */}
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-muted-foreground">
                                Note
                            </label>
                            <div className="text-base text-muted-foreground bg-muted px-3 py-2 rounded-md min-h-[80px] whitespace-pre-wrap">
                                {fundSource.note || "-"}
                            </div>
                        </div>

                        {/* Created At */}
                        {fundSource.createdAt && (
                            <div className="grid gap-2">
                                <label className="text-sm font-semibold text-muted-foreground">
                                    Created At
                                </label>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(fundSource.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="py-4 text-center text-muted-foreground">
                        No data available
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}