"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateExternalUnitRequest } from "@/dtos/other";

interface CreateExternalUnitDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateExternalUnitDialog({ open, onOpenChange }: CreateExternalUnitDialogProps) {
    const [formData, setFormData] = useState<CreateExternalUnitRequest>({
        unitName: "",
        address: "",
        phoneNumber: "",
        taxCode: "",
        bankAccountNumber: "",
        bankName: "",
        fax: "",
        fromContractPeriod: "",
        toContractPeriod: "",
        fieldOfActivity: "",
        supply: "",
    });

    const handleSubmit = () => {
        // TODO: Implement API call to create external unit
        console.log("Creating external unit:", formData);
        onOpenChange(false);
        setFormData({
            unitName: "",
            address: "",
            phoneNumber: "",
            taxCode: "",
            bankAccountNumber: "",
            bankName: "",
            fax: "",
            fromContractPeriod: "",
            toContractPeriod: "",
            fieldOfActivity: "",
            supply: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New External Unit</DialogTitle>
                    <DialogDescription>
                        Add a new external unit (supplier/partner). Fill in all required fields.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Basic Information */}
                    <div className="border-b pb-4">
                        <h3 className="font-semibold mb-3">Basic Information</h3>
                        <div className="grid gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="unitName">Unit Name *</Label>
                                <Input
                                    id="unitName"
                                    placeholder="e.g., ABC Supplier Co."
                                    value={formData.unitName}
                                    onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input
                                    id="address"
                                    placeholder="Enter full address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                                    <Input
                                        id="phoneNumber"
                                        placeholder="e.g., 0123456789"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="fax">Fax</Label>
                                    <Input
                                        id="fax"
                                        placeholder="e.g., 0123456789"
                                        value={formData.fax}
                                        onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tax & Bank Information */}
                    <div className="border-b pb-4">
                        <h3 className="font-semibold mb-3">Tax & Bank Information</h3>
                        <div className="grid gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="taxCode">Tax Code</Label>
                                <Input
                                    id="taxCode"
                                    placeholder="e.g., 0123456789"
                                    value={formData.taxCode}
                                    onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                                    <Input
                                        id="bankAccountNumber"
                                        placeholder="e.g., 1234567890"
                                        value={formData.bankAccountNumber}
                                        onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Input
                                        id="bankName"
                                        placeholder="e.g., Vietcombank"
                                        value={formData.bankName}
                                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contract & Activity Information */}
                    <div>
                        <h3 className="font-semibold mb-3">Contract & Activity Information</h3>
                        <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="fromContractPeriod">From Contract Period</Label>
                                    <Input
                                        id="fromContractPeriod"
                                        type="date"
                                        value={formData.fromContractPeriod}
                                        onChange={(e) => setFormData({ ...formData, fromContractPeriod: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="toContractPeriod">To Contract Period</Label>
                                    <Input
                                        id="toContractPeriod"
                                        type="date"
                                        value={formData.toContractPeriod}
                                        onChange={(e) => setFormData({ ...formData, toContractPeriod: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fieldOfActivity">Field of Activity</Label>
                                <Input
                                    id="fieldOfActivity"
                                    placeholder="e.g., Equipment Supply"
                                    value={formData.fieldOfActivity}
                                    onChange={(e) => setFormData({ ...formData, fieldOfActivity: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="supply">Supply/Services</Label>
                                <Input
                                    id="supply"
                                    placeholder="Describe what this unit supplies or provides"
                                    value={formData.supply}
                                    onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit}>
                        Create External Unit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}