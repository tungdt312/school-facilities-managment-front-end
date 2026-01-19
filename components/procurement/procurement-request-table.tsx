"use client"

import React, { useEffect, useMemo, useState } from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table';
import { useDebounce } from '@/hooks/use-rebounce';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import {
    ArrowUpDown,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns2,
    ExternalLink,
    Filter,
    Loader2,
    PackagePlus,
    User,
    ClipboardList
} from 'lucide-react';
import { Input } from '../ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { VoucherStatus } from '@/constaints/enum';
import { ImportRequestResponse } from '@/dtos/import';
import { MOCK_IMPORT_REQUESTS } from "@/components/mock-data/import-data";
import { formatISODate } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {CreateImportRequestDialog} from "@/components/procurement/create-procurement-request-dialog";
import {CreateImportVoucherDialog} from "@/components/procurement/create-procurement-dialog";

export const ImportRequestTable = () => {
    const [data, setData] = useState<ImportRequestResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatuses, setSelectedStatuses] = useState<VoucherStatus[]>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const columns: ColumnDef<ImportRequestResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
            size: 40,
        },
        {
            accessorKey: "requestId",
            meta: { label: "Request ID" },
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
                    ID <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.original.requestId}</div>,
        },
        {
            accessorKey: "createdByName",
            meta: { label: "Requester" },
            header: "Requester",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="size-3.5 text-muted-foreground" />
                    <span>{row.original.createdByName}</span>
                </div>
            ),
        },
        {
            id: "items",
            header: "Items",
            cell: ({ row }) => {
                const totalQty = row.original.details.reduce((sum, item) => sum + item.quantity, 0);
                return (
                    <Badge variant={"outline"}>
                        <span>{totalQty} device(s)</span>
                    </Badge>
                );
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <div className="flex items-center gap-2">
                    <span>Status</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Filter className={`h-4 w-4 ${selectedStatuses.length > 0 ? "text-primary fill-primary" : ""}`} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.values(VoucherStatus).map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={selectedStatuses.includes(status)}
                                    onCheckedChange={(checked) => {
                                        setSelectedStatuses(prev => checked ? [...prev, status] : prev.filter(s => s !== status));
                                    }}
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge className={
                        status === VoucherStatus.Approved ? "bg-emerald-500 hover:bg-emerald-600" :
                            status === VoucherStatus.Pending ? "bg-amber-500 hover:bg-amber-600" :
                                status === VoucherStatus.Rejected ? "bg-destructive hover:bg-destructive/90" : "bg-slate-500"
                    }>
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "createdAt",
            meta: { label: "Created At" },
            header: "Date",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted-foreground ">
                    <span>{formatISODate(row.original.createdAt)}</span>
                </div>
            ),
        },{
            accessorKey: "note",
            header: "Note",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate italic text-muted-foreground" title={row.original.note}>
                    {row.original.note || "No note"}
                </div>
            ),
        },
        {
            id: "action",
            header: "",
            cell: ({ row }) => (
                <Link href={`/procurement/request/${row.original.requestId}`}>
                    <ExternalLink className="text-muted-foreground size-4 hover:text-primary transition-colors" />
                </Link>
            ),
        },
    ], [selectedStatuses]);

    useEffect(() => {
        setIsLoading(true);
        let filtered = [...MOCK_IMPORT_REQUESTS];
        if (debouncedSearch) {
            filtered = filtered.filter(d =>
                d.requestId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                d.createdByName.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }
        if (selectedStatuses.length > 0) {
            filtered = filtered.filter(d => selectedStatuses.includes(d.status));
        }
        setData(filtered);
        setIsLoading(false);
    }, [debouncedSearch, selectedStatuses]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnVisibility, rowSelection, pagination },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getRowId: (row) => row.requestId,
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                <Input
                    placeholder="Search Request ID or Requester..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 w-full max-w-sm"
                />
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <Columns2 className="mr-2 size-4" /> Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table.getAllColumns().filter(c => c.getCanHide()).map(column => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                                >
                                    {(column.columnDef.meta as any)?.label || column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CreateImportRequestDialog/>
                </div>
            </div>

            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Loading...</TableCell></TableRow>
                        ) : data.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/30">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No requests found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Phân trang - Giống với bảng bạn đã upload */}
        </div>
    );
}