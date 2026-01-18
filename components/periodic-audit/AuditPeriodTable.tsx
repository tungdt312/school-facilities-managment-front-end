"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/use-rebounce';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns2,
    ExternalLink,
    Filter,
    Loader,
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CreateAuditPeriodDialog } from "./CreateAuditPeriodDialog";

// Mock data for Audit Periods
interface AuditPeriod {
    periodId: string;
    auditName: string;
    startDate: string;
    endDate: string;
    status: "Active" | "Completed" | "Pending";
    auditsCount: number;
}

const MOCK_AUDIT_PERIODS: AuditPeriod[] = [
    {
        periodId: "AP001",
        auditName: "Q1 2024 Audit",
        startDate: "2024-01-01",
        endDate: "2024-03-31",
        status: "Completed",
        auditsCount: 5,
    },
    {
        periodId: "AP002",
        auditName: "Q2 2024 Audit",
        startDate: "2024-04-01",
        endDate: "2024-06-30",
        status: "Active",
        auditsCount: 3,
    },
    {
        periodId: "AP003",
        auditName: "Q3 2024 Audit",
        startDate: "2024-07-01",
        endDate: "2024-09-30",
        status: "Pending",
        auditsCount: 0,
    },
];

export const AuditPeriodTable = () => {
    const [data, setData] = useState<AuditPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const columns: ColumnDef<AuditPeriod>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            size: 40,
            enableSorting: false,
        },
        {
            accessorKey: "auditName",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="px-0 hover:bg-transparent">
                    Audit Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="text-muted-foreground font-medium">{row.original.auditName}</div>,
        },
        {
            accessorKey: "startDate",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="px-0 hover:bg-transparent">
                    Start Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="text-muted-foreground">{new Date(row.original.startDate).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "endDate",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="px-0 hover:bg-transparent">
                    End Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="text-muted-foreground">{new Date(row.original.endDate).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "auditsCount",
            header: "Audits Count",
            cell: ({ row }) => <div className="text-muted-foreground font-medium">{row.original.auditsCount}</div>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (<div className="flex items-center gap-2">
                    <span>Status</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Filter
                                    className={`h-4 w-4 ${selectedStatuses.length > 0 ? "text-primary fill-primary" : ""}`} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                            <DropdownMenuLabel>Status filter</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {["Active", "Completed", "Pending"].map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={selectedStatuses.includes(status)}
                                    onCheckedChange={(checked) => {
                                        setSelectedStatuses(prev =>
                                            checked
                                                ? [...prev, status]
                                                : prev.filter(s => s != status)
                                        );
                                        setPagination(p => ({ ...p, pageIndex: 0 }));
                                    }}
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            ))}
                            {selectedStatuses.length > 0 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <div
                                        onClick={() => setSelectedStatuses([])}
                                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive hover:text-destructive"
                                    >
                                        Clear filter
                                    </div>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>)
            },
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    <Badge variant={row.original.status === "Completed" ? "default" : row.original.status === "Active" ? "secondary" : "outline"}>
                        {row.original.status}
                    </Badge>
                </div>
            ),
        },
    ], [selectedStatuses]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            setData(MOCK_AUDIT_PERIODS);
            setRowCount(MOCK_AUDIT_PERIODS.length);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load audit periods");
            setData([]);
            setRowCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize, sorting, debouncedSearch, selectedStatuses]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        rowCount: rowCount,

        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,

        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.periodId,
    });


    // Prevent hydration mismatch by only rendering interactive components after mount
    if (!isMounted) {
        return (
            <div className="w-full space-y-4 pt-6">
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Loading...</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader className="animate-spin inline-block mr-2" /> Loading data...
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div className="w-full space-y-4 pt-6">
            <div className="flex items-center gap-2 w-full ">
                <Input
                    placeholder="Find audit period..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-8 w-full"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Columns2 className="mr-2 size-4" /> View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {table.getAllColumns().filter(c => c.getCanHide()).map(column => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {(column.columnDef.meta as any)?.label || column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <CreateAuditPeriodDialog onSuccess={fetchData} />
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Loader className="animate-spin inline-block mr-2" /> Loading data...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Data not found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground hidden sm:block">
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
                                <SelectValue placeholder={pagination.pageSize} />
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
                            <ChevronsLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Previous page</span>
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Next page</span>
                            <ChevronRight className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Last page</span>
                            <ChevronsRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
