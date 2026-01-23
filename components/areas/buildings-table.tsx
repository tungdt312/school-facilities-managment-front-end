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
    Building2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns2,
    ExternalLink,
    Loader2,
    PlusCircle
} from "lucide-react"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form"
import {Input} from "../ui/input"
import {BuildingResponse} from "@/dtos/building"
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
import {MOCK_BUILDINGS} from "../mock-data/areas-data"
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getBuildingsList, postBuilding} from "@/services/areaService";
import {PageRequest} from "@/dtos/base";
import {getSortString} from "@/lib/utils";
import {getUsersList} from "@/services/userService";

const createBuildingSchema = z.object({
    buildingName: z.string().min(1, "Building name is required"),
    note: z.string().optional(),
})
type FormValues = z.infer<typeof createBuildingSchema>

export function CreateBuildingDialog({onSuccess}: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(createBuildingSchema),
        defaultValues: {buildingName: "", note: ""},
    })

    async function onSubmit(values: z.infer<typeof createBuildingSchema>) {
        setIsSubmitting(true)
        try {
            // Simulated API
            const res = await postBuilding(values)
            toast.success("Building created successfully")
            setOpen(false)
            form.reset()
            onSuccess()
        } catch (error) {
            toast.error("Failed to create building")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1 px-3">
                    <PlusCircle className="h-4 w-4"/>
                    <span>Add Building</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Building</DialogTitle>
                    <DialogDescription>
                        Enter the building details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="buildingName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Building Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Block A, Main Hall" {...field} />
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
                                        <Input placeholder="Additional info..." {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Create Building
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


export const BuildingTable = () => {
    const [data, setData] = useState<BuildingResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);

    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({pageIndex: 1, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const columns: ColumnDef<BuildingResponse>[] = useMemo(() => [
        // {
        //     id: "select",
        //     header: ({table}) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected()}
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Select all"
        //         />
        //     ),
        //     cell: ({row}) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Select row"
        //         />
        //     ),
        //     size: 40,
        // },
        {
            accessorKey: "buildingId",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    ID <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => (
                <div className="flex items-center gap-2">
                    <span>{row.original.buildingId}</span>
                </div>
            ),
        },
        {
            accessorKey: "buildingName",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    Building Name <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => (
                <div className="flex items-center gap-2 font-medium">
                    <Building2 className="size-4 text-muted-foreground"/>
                    <span>{row.original.buildingName}</span>
                </div>
            ),
        },
        {
            accessorKey: "floorCount",
            header: "Floors",
            cell: ({row}) => <div className="font-mono text-center w-12">{row.original.floorCount}</div>,
        },
        {
            accessorKey: "note",
            header: "Notes",
            cell: ({row}) => (
                <div className="truncate max-w-[250px] text-muted-foreground text-sm italic">
                    {row.original.note || "No notes"}
                </div>
            ),
        },
        {
            accessorKey: "action",
            header: "",
            cell: ({row}) =>
                <div className="flex">
                    <Link href={`/areas/building/${row.original.buildingId}`}><ExternalLink
                        className={"text-muted-foreground size-4"}/></Link>
                </div>,
        },
    ], []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let filterQuery = "";
            if (debouncedSearch) {
                filterQuery = `BuildingName=~${debouncedSearch}`; // Ví dụ cú pháp RSQL/JPA Criteria
            }
            const req: PageRequest = {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort: getSortString(sorting),
                filter: filterQuery || undefined,
            }
            const res = await getBuildingsList(req)
            setData(res.content)
            console.log(res)
            setRowCount(res.totalElements)
            setIsLoading(false);res.totalElements
        } catch (e) {
            console.error(e);
            toast.error("Failed to load buildings");
            setData([]);
            setRowCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination, sorting, debouncedSearch]);

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
        getRowId: (row) => row.buildingId,
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-2">
                <Input
                    placeholder="Search buildings..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-8 w-full max-w-sm"
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
                    <CreateBuildingDialog onSuccess={fetchData}/>
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
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Loader2 className="animate-spin inline-block mr-2 h-4 w-4"/>
                                    Loading buildings...
                                </TableCell>
                            </TableRow>
                        ) : data.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    No buildings found.
                                </TableCell>
                            </TableRow>
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