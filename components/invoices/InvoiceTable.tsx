"use client"

import { useState, useEffect, useMemo } from "react";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Columns2, Edit2, Loader, Plus, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceResponse } from "@/dtos/other";
import { CreateInvoiceDialog } from "./CreateInvoiceDialog";
import { EditInvoiceDialog } from "./EditInvoiceDialog";
import { Badge } from "@/components/ui/badge";

const MOCK_INVOICES: InvoiceResponse[] = [
    {
        invoiceId: "INV001",
        invoiceNumber: "INV-2026-001",
        type: "IMPORT",
        totalAmount: 50000000,
        createdBy: "U001",
        createdByName: "John Nguyen",
        createdAt: "2026-01-15",
        note: "Import equipment from supplier",
    },
    {
        invoiceId: "INV002",
        invoiceNumber: "INV-2026-002",
        type: "MAINTENANCE",
        totalAmount: 15000000,
        createdBy: "U002",
        createdByName: "Jane Smith",
        createdAt: "2026-01-17",
        note: "Maintenance for air conditioning",
    },
    {
        invoiceId: "INV003",
        invoiceNumber: "INV-2026-003",
        type: "REPAIR",
        totalAmount: 8000000,
        createdBy: "U003",
        createdByName: "Mike Johnson",
        createdAt: "2026-01-20",
        note: "Repair water system",
    },
];

const getTypeColor = (type: string) => {
    switch (type) {
        case "IMPORT":
            return "bg-blue-100 text-blue-800";
        case "MAINTENANCE":
            return "bg-green-100 text-green-800";
        case "REPAIR":
            return "bg-orange-100 text-orange-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export const InvoiceTable = () => {
    const [data, setData] = useState<InvoiceResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponse | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

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

        let filteredData = MOCK_INVOICES;

        if (debouncedSearch) {
            filteredData = filteredData.filter(item =>
                item.invoiceNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.invoiceId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.createdByName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.note?.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        if (selectedTypes.length > 0) {
            filteredData = filteredData.filter(item =>
                selectedTypes.includes(item.type)
            );
        }

        setRowCount(filteredData.length);
        setData(filteredData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, selectedTypes]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const columns: ColumnDef<InvoiceResponse>[] = useMemo(() => [
        {
            accessorKey: "invoiceId",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Invoice ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.getValue("invoiceId"),
        },
        {
            accessorKey: "invoiceNumber",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Invoice Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("invoiceNumber")}</div>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue("type") as string;
                return (
                    <Badge className={`${getTypeColor(type)} border-0`}>
                        {type}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "totalAmount",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Total Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const amount = row.getValue("totalAmount") as number;
                return (
                    <div className="font-medium">
                        {amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                );
            },
        },
        {
            accessorKey: "createdByName",
            header: "Created By",
            cell: ({ row }) => row.getValue("createdByName"),
        },
        {
            accessorKey: "note",
            header: "Note",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {row.getValue("note") || "-"}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Created At
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
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setSelectedInvoice(row.original);
                            setIsEditDialogOpen(true);
                        }}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(row.original.invoiceId)}
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

    const handleDelete = (invoiceId: string) => {
        // TODO: Implement delete API call
        console.log("Deleting invoice:", invoiceId);
        setData(data.filter(item => item.invoiceId !== invoiceId));
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
                    placeholder="Search by invoice number, ID, creator, or note..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-8 w-full"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                            Type {selectedTypes.length > 0 && `(${selectedTypes.length})`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {["IMPORT", "MAINTENANCE", "REPAIR", "OTHER"].map((type) => (
                            <DropdownMenuCheckboxItem
                                key={type}
                                checked={selectedTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedTypes([...selectedTypes, type]);
                                    } else {
                                        setSelectedTypes(
                                            selectedTypes.filter((t) => t !== type)
                                        );
                                    }
                                }}
                            >
                                {type}
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
                    Create Invoice
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

            <CreateInvoiceDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
            {selectedInvoice && (
                <EditInvoiceDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    invoice={selectedInvoice}
                />
            )}
        </div>
    );
};