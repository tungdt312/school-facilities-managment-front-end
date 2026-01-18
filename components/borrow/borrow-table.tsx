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
    Clock,
    User,
    Handshake,
    Package
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
import { BorrowStatus } from '@/constaints/enum';
import { BorrowVoucherResponse } from '@/dtos/borrow';
import { MOCK_BORROW_VOUCHERS } from "@/components/mock-data/borrow-data";
import { formatISODate } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const BorrowVoucherTable = () => {
    const [data, setData] = useState<BorrowVoucherResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatuses, setSelectedStatuses] = useState<BorrowStatus[]>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const columns: ColumnDef<BorrowVoucherResponse>[] = useMemo(() => [
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
            accessorKey: "borrowId",
            meta: { label: "Borrow ID" },
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
                    ID <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.original.borrowId}</div>,
        },
        {
            accessorKey: "borrowerName",
            meta: { label: "Borrower" },
            header: "Borrower",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="size-3.5 text-muted-foreground" />
                    <span>{row.original.borrowerName}</span>
                </div>
            ),
        },{
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
                            {Object.values(BorrowStatus).map((status) => (
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
                        status === BorrowStatus.Returned ? "bg-emerald-500 hover:bg-emerald-600" :
                            status === BorrowStatus.Borrowing ? "bg-blue-500 hover:bg-blue-600" :
                                status === BorrowStatus.Pending ? "bg-amber-500 hover:bg-amber-600" :
                                    status === BorrowStatus.Approved ? "bg-purple-500 hover:bg-purple-600" : "bg-slate-500"
                    }>
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "createdAt",
            meta: { label: "Borrow Date" },
            header: "Borrow Date",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>{formatISODate(row.original.createdAt)}</span>
                </div>
            ),
        },
        {
            accessorKey: "returnDate",
            meta: { label: "Return Date" },
            header: "Return Date",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-xs font-medium">
                    <Clock className={`size-3.5 ${row.original.status === BorrowStatus.Borrowing ? "text-amber-500" : "text-muted-foreground"}`} />
                    <span>{row.original.returnDate ? formatISODate(row.original.returnDate) : "---"}</span>
                </div>
            ),
        },

        {
            id: "action",
            header: "",
            cell: ({ row }) => (
                <Link href={`/borrow/vouchers/${row.original.borrowId}`}>
                    <ExternalLink className="text-muted-foreground size-4 hover:text-primary transition-colors" />
                </Link>
            ),
        },
    ], [selectedStatuses]);

    useEffect(() => {
        setIsLoading(true);
        let filtered = [...MOCK_BORROW_VOUCHERS];
        if (debouncedSearch) {
            filtered = filtered.filter(d =>
                d.borrowId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                d.borrowerName.toLowerCase().includes(debouncedSearch.toLowerCase())
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
        getRowId: (row) => row.borrowId,
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                <Input
                    placeholder="Search Borrow ID or Borrower..."
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
                        <DropdownMenuContent align="end" className="w-48">
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
                    <Link href="/borrow/create">
                        <Button size="sm" className="h-9 bg-primary">
                            <Handshake className="mr-2 size-4" /> New Borrow
                        </Button>
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
                            <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No borrow vouchers found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
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