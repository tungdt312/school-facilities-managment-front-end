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
    MoreHorizontal,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateAuditPeriodDialog } from "./CreateAuditPeriodDialog";
import { AuditPeriodDetail } from "./AuditPeriodDetail";
import { getPeriodicAudits, deletePeriodicAudit } from "@/services/auditService";
import { AuditPeriodResponse } from "@/dtos/audit";

export const AuditPeriodTable = () => {
    const [data, setData] = useState<AuditPeriodResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Detail dialog state
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

    const columns: ColumnDef<AuditPeriodResponse>[] = useMemo(() => [
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
            accessorKey: "periodicAuditName",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="px-0 hover:bg-transparent">
                    Audit Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="text-muted-foreground font-medium">{row.original.periodicAuditName}</div>,
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
            accessorKey: "responsiblePerson",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="px-0 hover:bg-transparent">
                    Responsible Person <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="text-muted-foreground">{row.original.responsiblePerson}</div>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetail(row.original.periodId)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDeleteRow(row.original.periodId)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            enableSorting: false,
        },
    ], []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getPeriodicAudits({
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort: sorting.length > 0 ? `${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}` : undefined,
                search: debouncedSearch || undefined,
            });

            setData(response.content || []);
            setRowCount(response.totalElements || 0);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load audit periods");
            setData([]);
            setRowCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetail = (periodId: string) => {
        setSelectedPeriodId(periodId);
        setDetailOpen(true);
    };

    const handleDeleteRow = async (periodId: string) => {
        if (!confirm("Are you sure you want to delete this audit period?")) return;

        try {
            await deletePeriodicAudit(periodId);
            toast.success("Audit period deleted successfully");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete audit period");
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize, sorting, debouncedSearch]);

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({ ...prev, pageIndex: 1 }));
    };

    return (
        <>
            <div className="w-full space-y-4 pt-6">
                <div className="flex items-center gap-2 w-full">
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
                                        <span className="inline-flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                                            Loading data...
                                        </span>
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
                            Page {table.getState().pagination.pageIndex} / {table.getPageCount()}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(1)}
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
                                onClick={() => table.setPageIndex(table.getPageCount())}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Last page</span>
                                <ChevronsRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Dialog */}
            <AuditPeriodDetail
                open={detailOpen}
                onOpenChange={setDetailOpen}
                periodId={selectedPeriodId}
                onSuccess={fetchData}
            />
        </>
    );
}