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
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns2,
    ExternalLink,
    Filter,
    Handshake,
    Loader2,
    User
} from 'lucide-react';
import {Input} from '../ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table';
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {BorrowStatus, BorrowStatusLabel, DeviceStatus, UserRoleLabel} from '@/constaints/enum';
import {BorrowVoucherResponse} from '@/dtos/borrow';
import {MOCK_BORROW_VOUCHERS} from "@/components/mock-data/borrow-data";
import {formatISODate, getSortString} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CreateBorrowVoucherDialog} from "@/components/borrow/create-borrow-dialog";
import {PageRequest} from "@/dtos/base";
import {getBorrowList} from "@/services/borrowService";
import {toast} from "sonner";
import {useCurrentUser} from "@/hooks/use-user";

export const BorrowVoucherTable = ({isUser}: {isUser?: boolean}) => {
    const [data, setData] = useState<BorrowVoucherResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [selectedStatuses, setSelectedStatuses] = useState<BorrowStatus[]>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 10 });
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
                            <DropdownMenuLabel>Status filter</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {Object.values(BorrowStatus)
                                .filter((v) => typeof v === "number") // Lọc lấy giá trị số
                                .map((statusValue) => (
                                    <DropdownMenuCheckboxItem
                                        key={statusValue}
                                        // roleValue ở đây là 0, 1, 2...
                                        checked={selectedStatuses.includes(statusValue as BorrowStatus)}
                                        onCheckedChange={(checked) => {
                                            setSelectedStatuses(prev =>
                                                checked
                                                    ? [...prev, statusValue as BorrowStatus]
                                                    : prev.filter(r => r !== statusValue)
                                            );
                                            setPagination(p => ({ ...p, pageIndex: 1 }));
                                        }}
                                    >
                                        {/* Hiển thị label tương ứng */}
                                        {UserRoleLabel[statusValue as number]}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            {selectedStatuses.length > 0 && (
                                <>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem
                                        onClick={() => setSelectedStatuses(prev =>[])}
                                        className="justify-center text-destructive focus:text-destructive"
                                    >
                                        Delete filter
                                    </DropdownMenuItem>
                                </>
                            )}
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
                                    status === BorrowStatus.Approved ? "bg-purple-500 hover:bg-purple-600" :
                                        status === BorrowStatus.Rejected ? "bg-red-500 hover:bg-red-600":"bg-slate-500"
                    }>
                        {BorrowStatusLabel[status]}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "createdAt",
            meta: { label: "Borrow Date" },
            header: "Borrow Date",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span>{formatISODate(row.original.createdAt)}</span>
                </div>
            ),
        },
        {
            accessorKey: "returnDate",
            meta: { label: "Return Date" },
            header: "Return Date",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span>{row.original.returnDate ? formatISODate(row.original.returnDate) : "---"}</span>
                </div>
            ),
        },

        {
            id: "action",
            header: "",
            cell: ({row}) => {
                // Check if isUser is true and bookingId exists
                if (!isUser) {
                    return (
                        <Link href={`/borrow/${row.original.borrowId}`}>
                            <ExternalLink className="text-muted-foreground size-4"/>
                        </Link>
                    );
                }
                return null; // Explicitly return null if condition isn't met
            },
        },
    ], [selectedStatuses]);
    const fetchData = async () => {
        setIsLoading(true);
        try {
            let filterQuery = "";
            if (debouncedSearch) {
                filterQuery += `BorrowerName=~${debouncedSearch}`; // Ví dụ cú pháp RSQL/JPA Criteria
            }
            if (selectedStatuses.length > 0) {
                if (debouncedSearch) {
                    filterQuery += `&`
                }
                filterQuery += `Status==${selectedStatuses.join(",=")}`
            }
            if (isUser) {
                if (debouncedSearch) {
                    filterQuery += `&`
                }
                filterQuery += `BorrowerId==${useCurrentUser().userId}`
            }
            const req: PageRequest = {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort: getSortString(sorting),
                filter: filterQuery || undefined,
            }
            const res = await getBorrowList(req)
            setData(res.content)
            console.log(res)
            setIsLoading(false);
            setRowCount(res.totalElements)
        } catch (e) {
            console.error(e);
            toast.error("Failed to load borrow data");
            setData([]);
            setRowCount(0)
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData()
    }, [debouncedSearch, selectedStatuses, sorting]);

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
        getRowId: (row) => row.borrowId,
    });
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({...prev, pageIndex: 1})); // Reset về trang 1 khi tìm kiếm
    };
    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                <Input
                    placeholder="Search Borrower..."
                    value={searchTerm}
                    onChange={handleSearchChange}
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
                    <CreateBorrowVoucherDialog/>
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