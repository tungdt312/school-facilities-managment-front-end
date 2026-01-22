"use client"

import React, {useEffect, useMemo, useState} from 'react'
import {DeviceResponse} from "@/dtos/device"; // Giả sử đường dẫn DTO của bạn
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table';
import {useDebounce} from '@/hooks/use-rebounce';
import {Checkbox} from '../ui/checkbox';
import {Button} from '../ui/button';
import {
    ArrowUpDown,
    Building2,
    ChevronLeft,
    ChevronRight, ChevronsLeft, ChevronsRight,
    Columns2,
    DoorOpen,
    ExternalLink,
    Filter,
    Layers,
    Loader2,
    Monitor
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {formatNumber, getSortString} from "@/lib/utils";
import {DeviceStatus, DeviceStatusLabel, LocationType, RoomStatus, UserRoleLabel} from '@/constaints/enum';
import {MOCK_DEVICES} from "@/components/mock-data/devices-data";
import {PageRequest} from "@/dtos/base";
import {getUsersList} from "@/services/userService";
import {toast} from "sonner";
import {getDevicesList} from "@/services/deviceService";

// Hàm format số có dấu ngăn cách hàng nghìn như bạn yêu cầu trước đó
export const DeviceTable = ({locationId, locationType}: { locationId?: string, locationType?: LocationType }) => {
    const [data, setData] = useState<DeviceResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);

    const [selectedStatuses, setSelectedStatuses] = useState<DeviceStatus[]>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({pageIndex: 1, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const columns: ColumnDef<DeviceResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({table}) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    />
                </div>
            ),
            cell: ({row}) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                    />
                </div>
            ),
            size: 40,
        },
        {
            accessorKey: "equipmentId",
            meta: {label: "Device ID"},
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    ID <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => <div>{row.original.equipmentId}</div>,
        },
        {
            accessorKey: "equipmentName",
            meta: {label: "Device Name"},
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    Device Name <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => (
                <div className="flex items-center gap-2 font-medium">
                    <Monitor className="size-4 text-muted-foreground"/>
                    {row.original.equipmentName}
                </div>
            ),
        },
        {
            accessorKey: "equipmentCategoryName",
            header: "Category",
            cell: ({row}) => <Badge variant="secondary">{row.original.equipmentCategoryName}</Badge>,
        },
        {
            accessorKey: "locationName",
            header: "Location",
            cell: ({row}) => (
                <div className="flex items-center gap-1 text-xs">
                    {row.original.locationType == LocationType.Building &&
                        <Building2 className="size-3 text-muted-foreground"/>}
                    {row.original.locationType == LocationType.Floor &&
                        <Layers className="size-3 text-muted-foreground"/>}
                    {row.original.locationType == LocationType.Room &&
                        <DoorOpen className="size-3 text-muted-foreground"/>}
                    {row.original.locationName}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: ({column}) => (<div className="flex items-center gap-2">
                <span>Status</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Filter
                                className={`h-4 w-4 ${selectedStatuses.length > 0 ? "text-primary fill-primary" : ""}`}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                        <DropdownMenuLabel>Status filter</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        {Object.values(DeviceStatus)
                            .filter((v) => typeof v === "number") // Lọc lấy giá trị số
                            .map((statusValue) => (
                                <DropdownMenuCheckboxItem
                                    key={statusValue}
                                    // roleValue ở đây là 0, 1, 2...
                                    checked={selectedStatuses.includes(statusValue as DeviceStatus)}
                                    onCheckedChange={(checked) => {
                                        setSelectedStatuses(prev =>
                                            checked
                                                ? [...prev, statusValue as DeviceStatus]
                                                : prev.filter(r => r !== statusValue)
                                        );
                                        setPagination(p => ({...p, pageIndex: 1}));
                                    }}
                                >
                                    {/* Hiển thị label tương ứng */}
                                    {DeviceStatusLabel[statusValue as number]}
                                </DropdownMenuCheckboxItem>
                            ))}
                        {selectedStatuses.length > 0 && (
                            <>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onClick={() => setSelectedStatuses(prev => [])}
                                    className="justify-center text-destructive focus:text-destructive"
                                >
                                    Delete filter
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>),
            cell: ({row}) => {
                const status = row.original.status;
                return (
                    <Badge className={
                        status === DeviceStatus.Available ? "bg-emerald-500" :
                            status === DeviceStatus.Broken ? "bg-destructive" : "bg-slate-500"
                    }>
                        {DeviceStatus[status || 0]}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "unitPrice",
            header: "Price",
            cell: ({row}) => <div>${formatNumber(row.original.unitPrice || 0)}</div>,
        },
        {
            id: "action",
            header: "",
            cell: ({row}) => (
                <Link href={`/devices/${row.original.equipmentId}`}>
                    <ExternalLink className="text-muted-foreground size-4 hover:text-primary transition-colors"/>
                </Link>
            ),
        },
    ], [selectedStatuses]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const parts = [];

            if (debouncedSearch) {
                parts.push(`EquipmentName=~${debouncedSearch}`);
            }

            if (selectedStatuses?.length > 0) {
                parts.push(`Status==${selectedStatuses.join(",=")}`);
            }

            if (locationType && locationId) {
                parts.push(`LocationType==${locationType}`);
                parts.push(`LocationId==${locationId}`);
            }

            const filterQuery = parts.join("&");
            const req: PageRequest = {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort: getSortString(sorting),
                filter: filterQuery || undefined,
            }
            const res = await getDevicesList(req)
            setData(res.content)
            console.log(res)
            setIsLoading(false);
            setRowCount(res.totalElements)

        } catch (e) {
            console.error(e);
            toast.error("Failed to load devices");
            setData([]);
            setRowCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.pageIndex, pagination.pageSize, sorting, debouncedSearch, selectedStatuses]);

    const table = useReactTable({
        data,
        columns,
        state: {sorting, columnVisibility, rowSelection, pagination},
        manualPagination: true,
        rowCount: rowCount,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.equipmentId,
    });
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({...prev, pageIndex: 1})); // Reset về trang 1 khi tìm kiếm
    };
    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                <Input
                    placeholder="Search equipment name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-8 w-full max-w-sm"
                />
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Columns2 className="mr-2 size-4"/> Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table.getAllColumns().filter(c => c.getCanHide()).map(column => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                                >
                                    {(column.columnDef.meta as any)?.label || column.id.replace(/([A-Z])/g, ' $1')}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
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
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Loader2 className="animate-spin inline-block mr-2"/> Loading equipment...
                                </TableCell>
                            </TableRow>
                        ) : data.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">No devices
                                    found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination UI giữ nguyên từ UserTable */}
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
