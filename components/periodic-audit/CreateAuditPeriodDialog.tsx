"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { createPeriodicAudit } from '@/services/auditService';

const createAuditPeriodSchema = z.object({
    periodicAuditName: z.string().min(2, "Audit name must be at least 2 characters"),  // Changed from auditName
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    responsiblePerson: z.string().min(2, "Responsible person is required"),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
});

type FormValues = z.infer<typeof createAuditPeriodSchema>;

interface CreateAuditPeriodDialogProps {
    onSuccess: () => void;
}

export function CreateAuditPeriodDialog({ onSuccess }: CreateAuditPeriodDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(createAuditPeriodSchema),
        defaultValues: {
            periodicAuditName: "",
            startDate: "",
            endDate: "",
            responsiblePerson: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true);
        try {
            await createPeriodicAudit({
                periodicAuditName: values.periodicAuditName,
                startDate: values.startDate,
                endDate: values.endDate,
                responsiblePerson: values.responsiblePerson,
            });

            toast.success("Audit period created successfully");
            setOpen(false);
            form.reset();
            onSuccess(); // Refresh the table data
        } catch (error) {
            console.error(error);
            toast.error("Failed to create audit period");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add Audit Period</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Audit Period</DialogTitle>
                    <DialogDescription>
                        Create a new periodic audit schedule (e.g., Monthly, Quarterly, Yearly audit)
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="periodicAuditName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Audit Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Monthly Audit, Q1 2024 Audit" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="responsiblePerson"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsible Person ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Audit Period
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}