"use client"

import React, {useEffect, useMemo, useState} from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table';
import {useDebounce} from '@/hooks/use-rebounce';
import {Checkbox} from '../ui/checkbox';
import {Button} from '../ui/button';
import {
    ArrowUpDown,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns2,
    ExternalLink,
    FileText,
    Loader2,
    Receipt,
    Store,
    User
} from 'lucide-react';
import {Input} from '../ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table';
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {formatISODate, formatNumber, getSortString} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MOCK_LIQUIDATE_REQUESTS, MOCK_LIQUIDATE_VOUCHERS} from "@/components/mock-data/liquidates-data";
import {CreateLiquidateVoucherDialog} from "@/components/disposals/create-disposal-dialog";
import {PageRequest} from "@/dtos/base";
import {getImportVouchersList} from "@/services/importService";
import {toast} from "sonner";
import {getLiquidateVouchersList} from "@/services/disposalService";

// Giả định interface dựa trên Mock Data của bạn
interface LiquidateVoucherResponse {
    liquidateId: string;
    requestId: string;
    unitId: string;
    unitName: string;
    invoiceId: string;
    invoiceNumber: string;
    totalAmount: number;
    createdAt: string;
    createdBy: string;
    createdByName: string;
    details: any[];
}

export const LiquidateVoucherTable = () => {
    const [data, setData] = useState<LiquidateVoucherResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowSelection, setRowSelection] = useState({});
    const [rowCount, setRowCount] = useState(0);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({pageIndex: 1, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const columns: ColumnDef<LiquidateVoucherResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
            size: 40,
        },
        {
            accessorKey: "liquidateId",
            meta: {label: "Voucher ID"},
            header: ({column}) =>
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0">
                    ID <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>,
            cell: ({row}) => <div>{row.original.liquidateId}</div>,
        },
        {
            accessorKey: "invoiceNumber",
            meta: {label: "Invoice No."},
            header: "Invoice No.",
            cell: ({row}) => (
                <div className="flex items-center gap-2">
                    <Receipt className="size-3.5 text-muted-foreground"/>
                    <span>{row.original.invoiceNumber}</span>
                </div>
            ),
        },
        {
            accessorKey: "unitName",
            meta: {label: "Purchasing Unit"},
            header: "Purchasing Unit",
            cell: ({row}) => (
                <div className="flex items-center gap-2">
                    <Store className="size-3.5 text-muted-foreground"/>
                    <span className="max-w-[150px] truncate">{row.original.unitName}</span>
                </div>
            ),
        },
        {
            accessorKey: "totalAmount",
            meta: {label: "Total Amount"},
            header: "Amount",
            cell: ({row}) => {

                return <div>${formatNumber(row.original.totalAmount)}</div>;
            },
        },
        {
            accessorKey: "createdByName",
            meta: {label: "Creator"},
            header: "Creator",
            cell: ({row}) => (
                <div className="flex items-center gap-2">
                    <User className="size-3 text-muted-foreground"/>
                    <span>{row.original.createdByName}</span>
                </div>
            ),
        },

        {
            id: "items",
            header: "Items",
            cell: ({row}) => (
                <Badge variant="outline" >
                    {row.original.details.length} device(s)
                </Badge>
            ),
        },{
            accessorKey: "createdAt",
            meta: {label: "Created Date"},
            header: "Date",
            cell: ({row}) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{formatISODate(row.original.createdAt)}</span>
                </div>
            ),
        },
        {
            id: "action",
            header: "",
            cell: ({row}) => (
                <div className="flex justify-end px-2">
                    <Link href={`/disposal/${row.original.liquidateId}`}>
                        <ExternalLink className="text-muted-foreground size-4 hover:text-primary transition-colors"/>
                    </Link>
                </div>
            ),
        },
    ], []);

    // Logic xử lý dữ liệu (Search filter)
    const fetchData = async () => {
        try {
            setIsLoading(true);
            let filterQuery = "";
            if (debouncedSearch) {
                filterQuery += `CreatedByName=~${debouncedSearch}`; // Ví dụ cú pháp RSQL/JPA Criteria
            }
            const req: PageRequest = {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort: getSortString(sorting),
                filter: filterQuery || undefined,
            }
            const res = await getLiquidateVouchersList(req)
            setData(res.content)
            console.log(res)
            setRowCount(res.totalElements)
        } catch (e) {
            console.error(e);
            toast.error("Failed to load disposal voucher data");
            setData([]);
            setRowCount(0);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchData()
    }, [debouncedSearch, sorting]);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({...prev, pageIndex: 1})); // Reset về trang 1 khi tìm kiếm
    };
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
        // Bật chế độ Manual (Server-side)
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true, // Quan trọng
        rowCount: rowCount,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,

        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.liquidateId,
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                <div className="relative w-full max-w-sm">
                    <Input
                        placeholder="Search Voucher, Invoice or Unit..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="h-9 w-full"
                    />
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <Columns2 className="mr-2 size-4"/> Columns
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
                    <Link href={"/disposal/request"}><Button size="sm" variant={"outline"} className="h-9">Request</Button></Link>
                    <CreateLiquidateVoucherDialog/>
                </div>
            </div>

            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold text-foreground/80">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <Loader2 className="animate-spin inline-block mr-2"/> Loading vouchers...
                                </TableCell>
                            </TableRow>
                        ) : data.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/20 transition-colors cursor-default">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                    No liquidation vouchers found.
                                </TableCell>
                            </TableRow>
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
                        Page {table.getState().pagination.pageIndex} / {table.getPageCount() + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(1)}
                            disabled={pagination.pageIndex === 1}
                        >
                            <span className="sr-only">First page</span>
                            <ChevronsLeft className="size-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={pagination.pageIndex === 1}
                        >
                            <span className="sr-only">Previous page</span>
                            <ChevronLeft className="size-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={pagination.pageIndex >= table.getPageCount()}
                        >
                            <span className="sr-only">Next page</span>
                            <ChevronRight className="size-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount())}
                            disabled={pagination.pageIndex >= table.getPageCount()}
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