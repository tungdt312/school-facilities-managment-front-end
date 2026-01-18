"use client"

import {ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState,} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns2, ExternalLink, Loader, Plus} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useDebounce} from "@/hooks/use-debounce";
import {CreateAuditDialog} from "./CreateAuditDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface InventoryAudit {
    auditId: string;
    periodName: string;
    locationName: string;
    locationType: string;
    auditorId: string;
    auditorName: string;
    status: "Pending" | "Completed" | "In Progress";
    auditDate: string;
    totalDevices: number;
    checkedDevices: number;
}

const MOCK_INVENTORY_AUDITS: InventoryAudit[] = [
    {
        auditId: "IA001",
        periodName: "Monthly Audit - Jan 2026",
        locationName: "Building A",
        locationType: "Building",
        auditorId: "A001",
        auditorName: "John Nguyen",
        status: "Completed",
        auditDate: "2026-01-15",
        totalDevices: 50,
        checkedDevices: 50,
    },
    {
        auditId: "IA002",
        periodName: "Monthly Audit - Jan 2026",
        locationName: "Floor 2",
        locationType: "Floor",
        auditorId: "A002",
        auditorName: "Jane Smith",
        status: "In Progress",
        auditDate: "2026-01-17",
        totalDevices: 30,
        checkedDevices: 25,
    },
    {
        auditId: "IA003",
        periodName: "Quarterly Audit Q1 2026",
        locationName: "Room 201",
        locationType: "Room",
        auditorId: "A003",
        auditorName: "Mike Johnson",
        status: "Pending",
        auditDate: "2026-01-20",
        totalDevices: 20,
        checkedDevices: 0,
    },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case "Completed":
            return "bg-green-100 text-green-800";
        case "In Progress":
            return "bg-blue-100 text-blue-800";
        case "Pending":
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export const InventoryAuditTable = () => {
    const [data, setData] = useState<InventoryAudit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const fetchData = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        let filteredData = MOCK_INVENTORY_AUDITS;

        // Filter by search term
        if (debouncedSearch) {
            filteredData = filteredData.filter(item =>
                item.auditId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.locationName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.auditorName.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        // Filter by status
        if (selectedStatuses.length > 0) {
            filteredData = filteredData.filter(item =>
                selectedStatuses.includes(item.status)
            );
        }

        setRowCount(filteredData.length);
        setData(filteredData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, selectedStatuses]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const columns: ColumnDef<InventoryAudit>[] = [
        {
            accessorKey: "auditId",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Audit ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.getValue("auditId"),
        },
        {
            accessorKey: "periodName",
            header: "Period",
            cell: ({ row }) => row.getValue("periodName"),
        },
        {
            accessorKey: "locationName",
            header: "Location",
            cell: ({ row }) => {
                const location = row.getValue("locationName") as string;
                const locationType = row.original.locationType;
                return (
                    <div className="flex flex-col">
                        <span>{location}</span>
                        <span className="text-xs text-muted-foreground">{locationType}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "auditorName",
            header: "Auditor",
            cell: ({ row }) => row.getValue("auditorName"),
        },
        {
            accessorKey: "checkedDevices",
            header: "Progress",
            cell: ({ row }) => {
                const checked = row.getValue("checkedDevices") as number;
                const total = row.original.totalDevices;
                return (
                    <div className="flex flex-col gap-1">
                        <span>{checked}/{total}</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500"
                                style={{ width: `${(checked / total) * 100}%` }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge className={`${getStatusColor(status)} border-0`}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "auditDate",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Audit Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue("auditDate") as string);
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const auditId = row.original.auditId;
                return (
                    <Link href={`/audit/${auditId}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </Link>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
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
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

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
                    placeholder="Search audit ID, location, auditor..."
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
                        {["Pending", "In Progress", "Completed"].map((status) => (
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
                                {status}
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

            <CreateAuditDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}/>
        </div>
    );
};