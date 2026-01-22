"use client"

import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Plus, Trash2, FileText, Loader2,
    Package, CheckCircle2, ShoppingCart,
    ClipboardList, Calculator
} from 'lucide-react'
import { toast } from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CreateImportRequestRequest } from '@/dtos/import'
import {postImportRequest} from "@/services/importService";

// Validation Schema
const importRequestSchema = z.object({
    note: z.string().optional(),
    details: z.array(z.object({
        equipmentName: z.string().min(1, "Equipment name is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        note: z.string().optional()
    })).min(1, "At least one item must be requested")
})

type FormValues = z.infer<typeof importRequestSchema>

export const CreateImportRequestDialog = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(importRequestSchema),
        defaultValues: {
            note: '',
            details: [
                { equipmentName: '', quantity: 1, note: '' }
            ]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "details"
    })

    const onSubmit = async (data: CreateImportRequestRequest) => {
        setLoading(true)
        try {
            console.log("Submitting Import Request:", data)
            const res = await postImportRequest(data)
            toast.success("Procurement request submitted successfully")
            setOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Failed to submit request")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">Create Request
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                        New Import Request
                    </DialogTitle>
                    <DialogDescription>
                        Request procurement for new equipment or supplies.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">

                        {/* General Note */}
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5" /> Request Justification / Note
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Why is this equipment needed? (e.g., Department expansion...)"
                                            className="resize-none h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Items Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-sm font-bold ">
                                    Requested Items
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ equipmentName: '', quantity: 1, note: '' })}
                                    className="h-8 gap-1"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Add Item
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-3 items-start p-4 rounded-xl border bg-slate-50/50">
                                        <div className="col-span-12 md:col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.equipmentName`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Equipment Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. Dell UltraSharp 27\" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-6 md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Quantity</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input type="number" {...field}
                                                                       onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-5 md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`details.${index}.note`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Spec / Note</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="4K, 144Hz, etc." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-end pt-7">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-red-50"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="pt-6 border-t">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="gap-2 px-8">
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                )}
                                Submit Request
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}