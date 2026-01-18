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
    DoorOpen,
    ExternalLink,
    Loader2,
    PlusCircle
} from "lucide-react"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form"
import {Input} from "../ui/input"
import {RoomResponse} from "@/dtos/building"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {useDebounce} from "@/hooks/use-rebounce"
import {Checkbox} from "../ui/checkbox"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table"
import {MOCK_BUILDINGS, MOCK_ROOM_TYPES} from "../mock-data/areas-data"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {BorrowStatus} from "@/constaints/enum";

// 1. Room Schema
const createRoomSchema = z.object({
    floorId: z.string().min(1, "Floor is required"),
    roomName: z.string().min(1, "Room name is required"),
    roomTypeId: z.string().min(1, "Room type is required"),
    note: z.string().optional(),
})

type RoomFormValues = z.infer<typeof createRoomSchema>

export function CreateRoomDialog({floorId, onSuccess}: { floorId?: string, onSuccess: () => void }) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<RoomFormValues>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            floorId: floorId || "",
            roomName: "",
            roomTypeId: "",
            note: ""
        },
    })

    async function onSubmit(values: RoomFormValues) {
        setIsSubmitting(true)
        try {
            await new Promise(r => setTimeout(r, 1000))
            toast.success("Room created successfully")
            setOpen(false)
            form.reset()
            onSuccess()
        } catch (error) {
            toast.error("Failed to create room")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1 px-3">
                    <PlusCircle className="h-4 w-4"/>
                    <span>Add Room</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Create a new room for the selected floor.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="roomName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Room Name / Number</FormLabel>
                                    <FormControl><Input placeholder="e.g., Room 101, Lab A" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roomTypeId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Room Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {MOCK_ROOM_TYPES.map((type) => (
                                                <SelectItem key={type.roomTypeId} value={type.roomTypeId}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{type.typeName}</span>
                                                        <span
                                                            className="text-[10px] text-muted-foreground">{type.description}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter><Button type="submit" disabled={isSubmitting} className="w-full">Save
                            Room</Button></DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export const RoomTable = ({floorId}: { floorId?: string }) => {
    const [data, setData] = useState<RoomResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);

    const [selectedStatus, setSelectedStatus] = useState<BorrowStatus[]>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const columns: ColumnDef<RoomResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({table}) => <Checkbox checked={table.getIsAllPageRowsSelected()}
                                           onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}/>,
            cell: ({row}) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)}/>,
            size: 40,
        },
        {
            accessorKey: "roomId",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    ID <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => (
                <div className="flex items-center gap-2">
                    <span>{row.original.roomId}</span>
                </div>
            ),
        },
        {
            accessorKey: "roomName",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    Room Name <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => (
                <div className="flex items-center gap-2 font-medium">
                    <DoorOpen className="size-4 text-muted-foreground"/>
                    <span>{row.original.roomName}</span>
                </div>
            ),
        },
        {
            accessorKey: "roomTypeName",
            header: "Type",
            cell: ({row}) => {
                const type = row.original.roomTypeName;
                return (
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <span>{type}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "capacity",
            header: "Capacity",
            cell: ({row}) => <span className="text-muted-foreground text-xs">{row.original.capacity}</span>,
        },
        {
            accessorKey: "floorName",
            header: "Floor",
            cell: ({row}) => <span className="text-muted-foreground text-xs">{row.original.floorName}</span>,
        },
        // {
        //     accessorKey: "status",
        //     header: ({column}) => {
        //         return (<div className="flex items-center gap-2">
        //             <span>Role</span>
        //             <DropdownMenu>
        //                 <DropdownMenuTrigger asChild>
        //                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        //                         <Filter
        //                             className={`h-4 w-4 ${selectedRoles.length > 0 ? "text-primary fill-primary" : ""}`}/>
        //                     </Button>
        //                 </DropdownMenuTrigger>
        //                 <DropdownMenuContent align="start" className="w-52">
        //                     <DropdownMenuLabel>Role filter</DropdownMenuLabel>
        //                     <DropdownMenuSeparator/>
        //                     {Object.values(UserRole).map((role) => (
        //                         <DropdownMenuCheckboxItem
        //                             key={role}
        //                             checked={selectedRoles.includes(role)}
        //                             onCheckedChange={(checked) => {
        //                                 setSelectedRoles(prev =>
        //                                     checked
        //                                         ? [...prev, role]
        //                                         : prev.filter(r=> r != role)
        //                                 );
        //                                 setPagination(p => ({...p, pageIndex: 0})); // Reset về trang 1
        //                             }}
        //                         >
        //                             {role}
        //                         </DropdownMenuCheckboxItem>
        //                     ))}
        //                     {selectedRoles.length > 0 && (
        //                         <>
        //                             <DropdownMenuSeparator/>
        //                             <DropdownMenuItem
        //                                 onClick={() => setSelectedRoles([])}
        //                                 className="justify-center text-destructive focus:text-destructive"
        //                             >
        //                                 Delete filter
        //                             </DropdownMenuItem>
        //                         </>
        //                     )}
        //                 </DropdownMenuContent>
        //             </DropdownMenu>
        //         </div>)
        //     },
        //     cell: ({row}) => (
        //         <div className="flex flex-wrap gap-1">
        //             <Badge variant="outline">{row.original.role}</Badge>
        //         </div>
        //     ),
        // },
        {
            id: "actions",
            header: "",
            cell: ({row}) => (
                <Link href={`/areas/room/${row.original.roomId}`}>
                    <ExternalLink className="size-4"/>
                </Link>
            ),
        },
    ], []);

    const fetchData = () => {
        setIsLoading(true);
        try {
            // Flatten Buildings -> Floors -> Rooms
            let allRooms: RoomResponse[] = MOCK_BUILDINGS
                .flatMap(b => b.floors)
                .flatMap(f => f.rooms);

            if (floorId) {
                allRooms = allRooms.filter(r => r.floorId === floorId);
            }

            if (debouncedSearch) {
                allRooms = allRooms.filter(r => r.roomName.toLowerCase().includes(debouncedSearch.toLowerCase()));
            }

            setData(allRooms);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [floorId, debouncedSearch]);
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <Input placeholder="Search rooms..." value={searchTerm} onChange={handleSearchChange}

                       className="h-8 w-full max-w-sm"/>
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
                    <CreateRoomDialog floorId={floorId} onSuccess={fetchData}/>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(header => (
                                    <TableHead
                                        key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={columns.length} className="h-24 text-center"><Loader2
                                className="animate-spin inline-block mr-2"/>Loading rooms...</TableCell></TableRow>
                        ) : data.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}
                                                   className="py-2.5">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={columns.length}
                                                 className="h-24 text-center text-muted-foreground">No rooms
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
    )
}