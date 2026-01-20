"use client"

import { useState, useEffect, useMemo } from "react";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Columns2, Edit2, Loader, Plus, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Eye } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RepairRequestResponse } from "@/dtos/repair";
import { CreateRepairRequestDialog } from "./CreateRepairRequestDialog";
import { EditRepairRequestDialog } from "./EditRepairRequestDialog";
import { CreateRepairVoucherDialog } from "./CreateRepairVoucherDialog";
import { Badge } from "@/components/ui/badge";
import { VoucherStatus } from "@/constaints/enum";

const MOCK_REQUESTS: RepairRequestResponse[] = [
    {
        requestId: "REP-REQ001",
        createdByName: "John Nguyen",
        createdAt: "2026-01-15T10:30:00Z",
        note: "Screen damage and keyboard issue",
        status: VoucherStatus.Pending,
        details: [
            { equipmentId: "EQ001", equipmentName: "Laptop Dell XPS 13", note: "Screen is cracked" },
            { equipmentId: "EQ006", equipmentName: "Monitor LG 27inch", note: "Not turning on" },
        ],
    },
    {
        requestId: "REP-REQ002",
        createdByName: "Jane Smith",
        createdAt: "2026-01-17T14:45:00Z",
        note: "Projector lamp replacement",
        status: VoucherStatus.Approved,
        details: [
            { equipmentId: "EQ002", equipmentName: "Projector Epson EB-X39", note: "Lamp needs replacement" },
        ],
    },
    {
        requestId: "REP-REQ003",
        createdByName: "Mike Johnson",
        createdAt: "2026-01-18T09:15:00Z",
        note: "Printer paper jam and toner issue",
        status: VoucherStatus.Rejected,
        details: [
            { equipmentId: "EQ003", equipmentName: "Printer HP LaserJet Pro", note: "Paper jam in tray 2" },
        ],
    },
];

const getStatusColor = (status: VoucherStatus) => {
    switch (status) {
        case VoucherStatus.Pending:
            return "bg-yellow-100 text-yellow-800";
        case VoucherStatus.Approved:
            return "bg-green-100 text-green-800";
        case VoucherStatus.Rejected:
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export const RepairRequestTable = () => {
    const [data, setData] = useState<RepairRequestResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isCreateVoucherDialogOpen, setIsCreateVoucherDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RepairRequestResponse | null>(null);
    const [selectedRequestForVoucher, setSelectedRequestForVoucher] = useState<string | undefined>();

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
        await new Promise(resolve => setTimeout(resolve, 500));

        let filteredData = MOCK_REQUESTS;

        if (debouncedSearch) {
            filteredData = filteredData.filter(item =>
                item.requestId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.createdByName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.note?.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        setRowCount(filteredData.length);
        setData(filteredData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const columns: ColumnDef<RepairRequestResponse>[] = useMemo(() => [
        {
            accessorKey: "requestId",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Request ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <span className="font-medium">{row.getValue("requestId")}</span>,
        },
        {
            accessorKey: "createdByName",
            header: "Created By",
            cell: ({ row }) => row.getValue("createdByName"),
        },
        {
            id: "equipmentCount",
            header: "Equipment Count",
            cell: ({ row }) => {
                const count = row.original.details.length;
                return <Badge variant="outline">{count} item{count > 1 ? "s" : ""}</Badge>;
            },
        },
        {
            accessorKey: "note",
            header: "Description",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {row.getValue("note")}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as VoucherStatus;
                return (
                    <Badge className={`${getStatusColor(status)} border-0`}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Created Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt") as string);
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setSelectedRequest(row.original);
                            setIsEditDialogOpen(true);
                        }}
                        title="View & Edit"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {row.original.status === VoucherStatus.Approved && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => {
                                setSelectedRequestForVoucher(row.original.requestId);
                                setIsCreateVoucherDialogOpen(true);
                            }}
                            title="Create Voucher"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(row.original.requestId)}
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], []);

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

    const handleDelete = (requestId: string) => {
        console.log("Deleting request:", requestId);
        setData(data.filter(item => item.requestId !== requestId));
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
                                <TableCell colSpan={7} className="h-24 text-center">
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
                    placeholder="Search by request ID, creator, or description..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-8 w-full"
                />

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
                    Create Request
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
                                <TableRow key={row.id}>
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

            {/* Pagination */}
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
                            <ChevronsLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <CreateRepairRequestDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
            {selectedRequest && (
                <EditRepairRequestDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    request={selectedRequest}
                />
            )}
            <CreateRepairVoucherDialog
                open={isCreateVoucherDialogOpen}
                onOpenChange={setIsCreateVoucherDialogOpen}
                requestId={selectedRequestForVoucher}
            />
        </div>
    );
};