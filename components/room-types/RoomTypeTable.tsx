"use client"

import { useState, useEffect, useMemo } from "react";
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Columns2, Edit2, Loader, Plus, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ExternalLink } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoomTypeResponse } from "@/dtos/building";
import { CreateRoomTypeDialog } from "./CreateRoomTypeDialog";
import { EditRoomTypeDialog } from "./EditRoomTypeDialog";
import { RoomTypeDetail } from "./RoomTypeDetail";
import { Badge } from "@/components/ui/badge";
import { getRoomTypes, deleteRoomType } from "@/services/room-typeService";
import { toast } from "sonner";

export const RoomTypeTable = () => {
    const [data, setData] = useState<RoomTypeResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState<RoomTypeResponse | null>(null);

    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        roomTypeId: false, // Ẩn cột Type ID
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 1, // 1-based pagination
        pageSize: 10,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await getRoomTypes({
                page: pagination.pageIndex,
                size: pagination.pageSize,
            });

            if (response?.content) {
                let filteredData = response.content;

                // Client-side filtering (nếu backend không hỗ trợ search)
                if (debouncedSearch) {
                    filteredData = filteredData.filter(item =>
                        item.typeName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                        item.roomTypeId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                        item.note?.toLowerCase().includes(debouncedSearch.toLowerCase())
                    );
                }

                setRowCount(response.totalElements || filteredData.length);
                setData(filteredData);
            }
        } catch (error) {
            console.error("Error fetching room types:", error);
            toast.error("Failed to load room types");
            setData([]);
            setRowCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, pagination.pageIndex, pagination.pageSize]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const columns: ColumnDef<RoomTypeResponse>[] = useMemo(() => [
        {
            accessorKey: "roomTypeId",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Type ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.getValue("roomTypeId"),
        },
        {
            accessorKey: "typeName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Type Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("typeName")}</div>
            ),
        },
        {
            accessorKey: "note",
            header: "Description",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground max-w-md truncate">
                    {row.getValue("note") || "-"}
                </div>
            ),
        },
        {
            id: "roomCount",
            header: "Room Count",
            cell: ({ row }) => {
                const roomCount = row.original.rooms?.length || 0;
                return (
                    <Badge variant="outline">
                        {roomCount} room{roomCount !== 1 ? "s" : ""}
                    </Badge>
                );
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
                        title="View Details"
                        onClick={() => {
                            setSelectedRoomType(row.original);
                            setIsDetailDialogOpen(true);
                        }}
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Edit"
                        onClick={() => {
                            setSelectedRoomType(row.original);
                            setIsEditDialogOpen(true);
                        }}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Delete"
                        onClick={() => handleDelete(row.original.roomTypeId)}
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
        setPagination(prev => ({ ...prev, pageIndex: 1 })); // Reset về page đầu
    };

    const handleDelete = async (roomTypeId: string) => {
        if (!confirm("Are you sure you want to delete this room type?")) {
            return;
        }

        try {
            await deleteRoomType(roomTypeId);
            toast.success("Room type deleted successfully");
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error deleting room type:", error);
            toast.error("Failed to delete room type");
        }
    };

    const handleCreateSuccess = () => {
        setIsCreateDialogOpen(false);
        fetchData();
    };

    const handleEditSuccess = () => {
        setIsEditDialogOpen(false);
        setSelectedRoomType(null);
        fetchData();
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
                                <TableCell colSpan={5} className="h-24 text-center">
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
                    placeholder="Search by type name, ID, or description..."
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
                    Create Room Type
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
                                    onClick={() => {
                                        setSelectedRoomType(row.original);
                                        setIsDetailDialogOpen(false);
                                    }}
                                    className="cursor-pointer hover:bg-muted/50"
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
                        Page {table.getState().pagination.pageIndex} / {table.getPageCount()}
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

            <CreateRoomTypeDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSuccess={handleCreateSuccess} />
            {selectedRoomType && (
                <RoomTypeDetail
                    open={isDetailDialogOpen}
                    onOpenChange={setIsDetailDialogOpen}
                    roomType={selectedRoomType}
                    onEdit={() => {
                        setIsDetailDialogOpen(false);
                        setIsEditDialogOpen(true);
                    }}
                />
            )}
            {selectedRoomType && (
                <EditRoomTypeDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    roomType={selectedRoomType}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};