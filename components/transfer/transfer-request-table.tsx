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
    MapPin,
    MoveHorizontal,
    User
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
import { TransferRequestResponse } from '@/dtos/transfer';
import { MOCK_TRANSFER_REQUESTS } from "@/components/mock-data/transfer-data";
import { formatISODate } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TransferRequestTable = () => {
    const [data, setData] = useState<TransferRequestResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatuses, setSelectedStatuses] = useState<VoucherStatus[]>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const columns: ColumnDef<TransferRequestResponse>[] = useMemo(() => [
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
            id: "route",
            header: "Route (Source → Destination)",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        <MapPin className="size-3" /> {row.original.sourceLocationName}
                    </div>
                    <MoveHorizontal className="size-3 text-muted-foreground" />
                    <div className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <MapPin className="size-3" /> {row.original.destinationLocationName}
                    </div>
                </div>
            ),
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
            cell: ({ row }) => (
                <Badge variant="outline" >
                    {row.original.details.length} device(s)
                </Badge>
            ),
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
                <div className=" text-muted-foreground">
                    {formatISODate(row.original.createdAt)}
                </div>
            ),
        },
        {
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
                <Link href={`/transfer/request/${row.original.requestId}`}>
                    <ExternalLink className="text-muted-foreground size-4 hover:text-primary transition-colors" />
                </Link>
            ),
        },
    ], [selectedStatuses]);

    useEffect(() => {
        setIsLoading(true);
        let filtered = [...MOCK_TRANSFER_REQUESTS];
        if (debouncedSearch) {
            filtered = filtered.filter(d =>
                d.requestId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                d.sourceLocationName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                d.destinationLocationName.toLowerCase().includes(debouncedSearch.toLowerCase())
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
            <div className="flex flex-col md:flex-row items-center gap-2">
                <Input
                    placeholder="Search ID, Location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 w-full max-w-sm"
                />
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <Columns2 className="mr-2 size-4" /> Columns
                    </Button>
                    <Link href="/transfer/requests/create">
                        <Button size="sm" className="h-9">New Request</Button>
                    </Link>
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
                            <TableRow><TableCell colSpan={columns.length} className="h-24 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Loading...</TableCell></TableRow>
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
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground hidden sm:block">
                    {/* Logic hiển thị row selected chỉ đúng trên trang hiện tại với server-side */}
                    {Object.keys(rowSelection).length} row(s) selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8 ml-auto">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium hidden sm:block">row(s) / page</p>
                        <Select
                            value={`${pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={pagination.pageSize}/>
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">First page</span>
                            <ChevronsLeft className="size-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Previous page</span>
                            <ChevronLeft className="size-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Next page</span>
                            <ChevronRight className="size-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Last page</span>
                            <ChevronsRight className="size-4"/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}