"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";
import Link from "next/link";
import { ExternalUnitResponse } from "@/dtos/other";
import { getExternalUnitById } from "@/services/external-unitService";
import { toast } from "sonner";

export default function ExternalUnitDetail() {
    const params = useParams();
    const [unit, setUnit] = useState<ExternalUnitResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUnitDetail = async () => {
            try {
                setIsLoading(true);
                const unitId = params.id as string;
                const data = await getExternalUnitById(unitId);
                setUnit(data);
            } catch (error) {
                toast.error("Failed to load external unit details");
                console.error("Error fetching external unit detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnitDetail();
    }, [params.id]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB");
        } catch {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="w-full space-y-4 pt-6">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!unit) {
        return (
            <div className="w-full space-y-4 pt-6">
                <p className="text-muted-foreground">External unit not found</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pt-6">
            <div className="flex items-center gap-2 mb-6">
                <Link href="/external-units">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">{unit.unitName}</h1>
                <Link href={`/external-units/${unit.unitId}/edit`}>
                    <Button size="sm" className="gap-2">
                        <Edit2 className="h-4 w-4" />
                        Edit
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {/* Basic Information */}
                <div className="border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Unit ID</p>
                            <p className="font-medium text-base">{unit.unitId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Unit Name</p>
                            <p className="font-medium text-base">{unit.unitName}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="font-medium text-base">{unit.address}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                            <p className="font-medium text-base">{unit.phoneNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Fax</p>
                            <p className="font-medium text-base">{unit.fax || "-"}</p>
                        </div>
                    </div>
                </div>

                {/* Tax & Bank Information */}
                <div className="border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Tax & Bank Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Tax Code</p>
                            <p className="font-medium text-base">{unit.taxCode || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Bank Account Number</p>
                            <p className="font-medium text-base">{unit.bankAccountNumber || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Bank Name</p>
                            <p className="font-medium text-base">{unit.bankName || "-"}</p>
                        </div>
                    </div>
                </div>

                {/* Contract & Activity Information */}
                <div className="border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Contract & Activity Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">From Contract Period</p>
                            <p className="font-medium text-base">{formatDate(unit.fromContractPeriod)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">To Contract Period</p>
                            <p className="font-medium text-base">{formatDate(unit.toContractPeriod)}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Field of Activity</p>
                            <p className="font-medium text-base">{unit.fieldOfActivity || "-"}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Supply/Services</p>
                            <p className="font-medium text-base">{unit.supply || "-"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
