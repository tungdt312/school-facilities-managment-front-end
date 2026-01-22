"use client"

import {ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState,} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns2, ExternalLink, Loader, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useDebounce} from "@/hooks/use-debounce";
import {CreateAuditDialog} from "./CreateAuditDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInventoryAudits, deleteInventoryAudit } from "@/services/auditService";
import { InventoryAuditResponse } from "@/dtos/audit";
import { AuditStatus, AuditStatusLabel } from "@/constaints/enum";
import { toast } from "sonner";

export interface InventoryAudit extends InventoryAuditResponse {
    // Fields now come from InventoryAuditResponse
}

const getStatusColor = (status: AuditStatus | number) => {
    switch (status) {
        case AuditStatus.Completed:
            return "bg-green-100 text-green-800";
        case AuditStatus.Pending:
            return "bg-yellow-100 text-yellow-800";
        case AuditStatus.Confirmed:
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getStatusLabel = (status: AuditStatus | number) => {
    const statusMap: Record<number, string> = {
        [AuditStatus.Pending]: "Pending",
        [AuditStatus.Completed]: "Completed",
        [AuditStatus.Confirmed]: "Confirmed",
    };
    return statusMap[status as number] || "Unknown";
};

export const InventoryAuditTable = () => {
    const [data, setData] = useState<InventoryAudit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [selectedStatuses, setSelectedStatuses] = useState<AuditStatus[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getInventoryAudits({
                page: pagination.pageIndex,
                size: pagination.pageSize,
            });
            
            let filteredData = response.content || [];

            // Filter by search term
            if (debouncedSearch) {
                filteredData = filteredData.filter(item =>
                    item.auditId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    item.locationName.toLowerCase().includes(debouncedSearch.toLowerCase())
                );
            }

            // Filter by status
            if (selectedStatuses.length > 0) {
                filteredData = filteredData.filter(item =>
                    selectedStatuses.includes(item.status)
                );
            }

            setRowCount(response.totalElements || 0);
            setData(filteredData as InventoryAudit[]);
        } catch (error) {
            console.error("Failed to fetch inventory audits:", error);
            toast.error("Failed to load inventory audits");
            setData([]);
            setRowCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAudit = async (auditId: string) => {
        if (!confirm("Are you sure you want to delete this inventory audit?")) return;

        setIsDeleting(auditId);
        try {
            await deleteInventoryAudit(auditId);
            toast.success("Inventory audit deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Failed to delete inventory audit:", error);
            toast.error("Failed to delete inventory audit");
        } finally {
            setIsDeleting(null);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, selectedStatuses, pagination]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const columns: ColumnDef<InventoryAudit>[] = [
        {
            accessorKey: "auditName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Audit Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.getValue("auditName"),
        },
        {
            accessorKey: "periodicAuditName",
            header: "Periodic Audit Name",
            cell: ({ row }) => row.getValue("periodicAuditName") || "-",
        },
        {
            accessorKey: "locationName",
            header: "Location",
            cell: ({ row }) => {
                const location = row.getValue("locationName") as string;
                return (
                    <div className="flex flex-col">
                        <span>{location || "-"}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "auditorFullName",
            header: "Auditor",
            cell: ({ row }) => row.getValue("auditorFullName") || "-",
        },
        {
            accessorKey: "auditDate",
            header: "Audit Date",
            cell: ({ row }) => {
                const date = row.getValue("auditDate") as string;
                return new Date(date).toLocaleDateString() || "-";
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as AuditStatus | number;
                return (
                    <Badge className={`${getStatusColor(status)} border-0`}>
                        {getStatusLabel(status)}
                    </Badge>
                );
            },
        },
        {
            id: "details",
            header: "Details",
            cell: ({ row }) => {
                const details = row.original.details || [];
                return (
                    <div className="text-sm text-muted-foreground">
                        {details.length} item(s)
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const auditId = row.original.auditId;
                const isDeletingThisAudit = isDeleting === auditId;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/audit/${auditId}`}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeleteAudit(auditId)}
                                disabled={isDeletingThisAudit}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeletingThisAudit ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(rowCount / pagination.pageSize),
        manualPagination: true,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({ ...prev, pageIndex: 1 }));
    };

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
                                <TableCell colSpan={8} className="h-24 text-center">
                                    <Loader className="animate-spin inline-block mr-2" /> Loading data...
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 pt-6">
            <div className="flex items-center gap-2 w-full">
                <Input
                    placeholder="Search audit ID, location..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-8 w-full"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                            Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {[AuditStatus.Pending, AuditStatus.Completed, AuditStatus.Confirmed].map((status) => (
                            <DropdownMenuCheckboxItem
                                key={status}
                                checked={selectedStatuses.includes(status)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedStatuses([...selectedStatuses, status]);
                                    } else {
                                        setSelectedStatuses(
                                            selectedStatuses.filter((s) => s !== status)
                                        );
                                    }
                                }}
                            >
                                {getStatusLabel(status)}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Columns2 className="h-4 w-4" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Audit
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
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

            <CreateAuditDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSuccess={() => fetchData()} />
        </div>
    );
};