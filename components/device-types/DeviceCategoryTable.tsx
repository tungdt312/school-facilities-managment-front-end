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
import { DeviceCategoryResponse } from "@/dtos/device";
import { CreateDeviceCategoryDialog } from "./CreateDeviceCategoryDialog";
import { EditDeviceCategoryDialog } from "./EditDeviceCategoryDialog";
import { DeviceCategoryDetail } from "./DeviceCategoryDetail";
import { Badge } from "@/components/ui/badge";
import { getDeviceCategories, deleteDeviceCategory } from "@/services/device-typeService";
import { toast } from "sonner";

export const DeviceCategoryTable = () => {
    const [data, setData] = useState<DeviceCategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<DeviceCategoryResponse | null>(null);

    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        equipmentCategoryId: false,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await getDeviceCategories({
                page: pagination.pageIndex + 1,
                size: pagination.pageSize,
                search: debouncedSearch || undefined,
            });
            
            setData(response.content || []);
            setRowCount(response.totalElements || 0);
        } catch (error) {
            console.error("Error fetching device categories:", error);
            toast.error("Failed to load device categories");
            setData([]);
            setRowCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data khi component mount hoặc dependencies thay đổi
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

    const columns: ColumnDef<DeviceCategoryResponse>[] = useMemo(() => [
        {
            accessorKey: "equipmentCategoryId",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Category ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.getValue("equipmentCategoryId"),
        },
        {
            accessorKey: "equipmentCategoryName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 p-0 px-0 hover:bg-transparent"
                >
                    Category Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("equipmentCategoryName")}</div>
            ),
        },
        {
            accessorKey: "note",
            header: "Note",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground max-w-md truncate">
                    {row.getValue("note") || "-"}
                </div>
            ),
        },
        {
            id: "equipmentCount",
            header: "Equipment Count",
            cell: ({ row }) => {
                const count = row.original.equipments?.length || 0;
                return (
                    <Badge variant="secondary">
                        {count} equipment{count !== 1 ? "s" : ""}
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
                            setSelectedCategory(row.original);
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
                            setSelectedCategory(row.original);
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
                        onClick={() => handleDelete(row.original.equipmentCategoryId)}
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
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    const handleDelete = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this device category?")) {
            return;
        }

        try {
            await deleteDeviceCategory(categoryId);
            toast.success("Device category deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Error deleting device category:", error);
            toast.error("Failed to delete device category");
        }
    };

    const handleCreateSuccess = () => {
        setIsCreateDialogOpen(false);
        fetchData();
    };

    const handleEditSuccess = () => {
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
        fetchData();
    };

    const handleDetailEdit = () => {
        setIsDetailDialogOpen(false);
        setIsEditDialogOpen(true);
    };

    return (
        <div className="w-full space-y-4 pt-6">
            <div className="flex items-center gap-2 w-full">
                <Input
                    placeholder="Search by category name, ID, or description..."
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
                    Create Category
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
                                    No data found
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
                        Page {table.getState().pagination.pageIndex + 1} / {Math.max(1, table.getPageCount())}
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

            <CreateDeviceCategoryDialog 
                open={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={handleCreateSuccess}
            />
            {selectedCategory && (
                <DeviceCategoryDetail
                    open={isDetailDialogOpen}
                    onOpenChange={setIsDetailDialogOpen}
                    category={selectedCategory}
                    onEdit={handleDetailEdit}
                />
            )}
            {selectedCategory && (
                <EditDeviceCategoryDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    category={selectedCategory}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};