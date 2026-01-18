"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import React, {useEffect, useMemo, useState} from "react"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog"
import {Button} from "../ui/button"
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns2,
    ExternalLink,
    Layers,
    Loader2,
    PlusCircle
} from "lucide-react"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form"
import {Input} from "../ui/input"
import {FloorResponse} from "@/dtos/building" // Ensure this points to your Floor DTO
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table"
import {useDebounce} from "@/hooks/use-rebounce"
import {Checkbox} from "../ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table"
import Link from "next/link";
import {MOCK_FLOORS_FLAT} from "@/components/mock-data/areas-data";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

// 1. Floor Schema
const createFloorSchema = z.object({
    buildingId: z.string().min(0, "Building is required"), // Usually passed from parent context
    floorName: z.string().min(1, "Floor name is required"),
    roomCount: z.number().min(0, "Room count cannot be negative"),
    note: z.string().optional(),
})

type FloorFormValues = z.infer<typeof createFloorSchema>

export function CreateFloorDialog({buildingId, onSuccess}: { buildingId?: string, onSuccess: () => void }) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FloorFormValues>({
        resolver: zodResolver(createFloorSchema),
        defaultValues: {
            buildingId: buildingId || "",
            floorName: "",
            roomCount: 0,
            note: ""
        },
    })

    async function onSubmit(values: FloorFormValues) {
        setIsSubmitting(true)
        try {
            console.log("Submitting Floor:", values)
            await new Promise(r => setTimeout(r, 1000))
            toast.success("Floor created successfully")
            setOpen(false)
            form.reset()
            onSuccess()
        } catch (error) {
            toast.error("Failed to create floor")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1 px-3">
                    <PlusCircle className="h-4 w-4"/>
                    <span>Add Floor</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Floor</DialogTitle>
                    <DialogDescription>
                        Enter floor details for this building.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="floorName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Floor Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 1st Floor, Basement" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roomCount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Room Count</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Extra details..." {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Create Floor
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

interface FloorTableProps {
    buildingId?: string; // Nhận buildingId từ props
}

export const FloorTable = ({buildingId}: FloorTableProps) => {
    const [data, setData] = useState<FloorResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);

    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const columns: ColumnDef<FloorResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
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
            accessorKey: "floorId",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    ID <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => (
                <div className="flex items-center gap-2">
                    <span>{row.original.floorId}</span>
                </div>
            ),
        },
        {
            accessorKey: "floorName",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    Floor Name <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => (
                <div className="flex items-center gap-2 font-medium">
                    <Layers className="size-4 text-muted-foreground"/>
                    <span>{row.original.floorName}</span>
                </div>
            ),
        },
        {
            accessorKey: "buildingName",
            header: "Building",
            cell: ({row}) => <span className="text-muted-foreground">{row.original.buildingName}</span>,
        },
        {
            accessorKey: "roomCount",
            header: "Rooms",
            cell: ({row}) => <div className="font-mono text-center w-12">{row.original.roomCount}</div>,
        },
        {
            accessorKey: "note",
            header: "Notes",
            cell: ({row}) => (
                <div className="truncate max-w-[200px] text-muted-foreground text-sm italic">
                    {row.original.note || "---"}
                </div>
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({row}) => (
                <Link href={`/areas/floor/${row.original.floorId}`}>
                    <ExternalLink className=" size-4"/>
                </Link>
            ),
        },
    ], []);
    const fetchData = () => {
        setIsLoading(true);
        try {
            // Lấy tất cả floors từ mock data phẳng
            let allFloors: FloorResponse[] = MOCK_FLOORS_FLAT;

            // Nếu có buildingId, lọc theo buildingId
            if (buildingId) {
                allFloors = allFloors.filter(f => f.buildingId === buildingId);
            }

            // Lọc theo search term
            if (searchTerm) {
                allFloors = allFloors.filter(f =>
                    f.floorName.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setData(allFloors);
        } catch (error) {
            console.error("Failed to fetch floors", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [buildingId, searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({...prev, pageIndex: 0})); // Reset về trang 1 khi tìm kiếm
    };

    const table = useReactTable({
        data,
        columns,
        state: {sorting, columnVisibility, rowSelection, pagination},
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-2">
                <Input
                    placeholder="Search floors..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-8 h-9 w-full"
                />
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <Columns2 className="mr-2 size-4"/> Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {table.getAllColumns().filter(c => c.getCanHide()).map(column => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id.replace(/([A-Z])/g, ' $1')}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CreateFloorDialog onSuccess={() => {
                    }} buildingId={buildingId}/>
                </div>
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={columns.length} className="h-24 text-center"><Loader2
                                className="animate-spin inline-block mr-2"/> Loading floors...</TableCell></TableRow>
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
                            <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No floors
                                found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
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
                            <ChevronsLeft className="size-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Previous page</span>
                            <ChevronLeft className="size-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Next page</span>
                            <ChevronRight className="size-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
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