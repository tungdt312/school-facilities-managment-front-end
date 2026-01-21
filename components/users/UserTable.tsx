"use client"
import React, {useEffect, useMemo, useState} from 'react'
import {UserResponse} from "@/dtos/user";
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
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns2,
    ExternalLink,
    Filter,
    Loader, Loader2,
    PlusCircle
} from 'lucide-react';
import {toast} from 'sonner';
import {Input} from '../ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MOCK_USERS} from "@/components/mock-data/users-data";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {UserRole, UserRoleLabel} from "@/constaints/enum";
import z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '../ui/dialog';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {formatISODate, getSortString} from "@/lib/utils";
import {getUsersList} from "@/services/userService";
import {PageRequest} from "@/dtos/base";

export const UserTable = () => {
    const [data, setData] = useState<UserResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0); // Tổng số bản ghi từ Server

    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({pageIndex: 1, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState(""); // Trạng thái ô tìm kiếm
    const debouncedSearch = useDebounce(searchTerm, 500); // Debounce để tránh spam API khi gõ

    // 3. Define Columns (Giữ nguyên UI, bỏ filterFn)
    const columns: ColumnDef<UserResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({table}) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({row}) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            size: 40,
            enableSorting: false,
        },
        {
            accessorKey: "userId",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    ID <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => <div>{row.original.userId}</div>,
        },
        {
            accessorKey: "fullName", // Giả sử search API map vào field này
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    Full Name <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => <div>{row.original.fullname}</div>, // Gọi fetchData wrapper
        },
        {
            accessorKey: "email",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    Email <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => <div className="truncate max-w-[200px]"
                                  title={row.original.email}>{row.original.email}</div>,
        },
        {
            accessorKey: "role",
            header: ({column}) => {
                return (<div className="flex items-center gap-2">
                    <span>Role</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Filter
                                    className={`h-4 w-4 ${selectedRoles.length > 0 ? "text-primary fill-primary" : ""}`}/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                            <DropdownMenuLabel>Role filter</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {Object.values(UserRole)
                                .filter((v) => typeof v === "number") // Lọc lấy giá trị số
                                .map((roleValue) => (
                                    <DropdownMenuCheckboxItem
                                        key={roleValue}
                                        // roleValue ở đây là 0, 1, 2...
                                        checked={selectedRoles.includes(roleValue as UserRole)}
                                        onCheckedChange={(checked) => {
                                            setSelectedRoles(prev =>
                                                checked
                                                    ? [...prev, roleValue as UserRole]
                                                    : prev.filter(r => r !== roleValue)
                                            );
                                            setPagination(p => ({ ...p, pageIndex: 1 }));
                                        }}
                                    >
                                        {/* Hiển thị label tương ứng */}
                                        {UserRoleLabel[roleValue as number]}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            {selectedRoles.length > 0 && (
                                <>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem
                                        onClick={() => setSelectedRoles([])}
                                        className="justify-center text-destructive focus:text-destructive"
                                    >
                                        Delete filter
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>)
            },
            cell: ({row}) => (
                <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">{UserRoleLabel[row.original.role] || "Unknown"}</Badge>
                </div>
            ),
        }, {
            accessorKey: "createdAt",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-0 hover:bg-transparent">
                    Created At <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => <div className="text-muted-foreground">{formatISODate(row.original.createdAt)}</div>,
        },
        {
            accessorKey: "action",
            header: "",
            cell: ({row}) =>
                <div className="flex">
                    <Link href={`/users/${row.original.userId}`}><ExternalLink
                        className={"text-muted-foreground size-4"}/></Link>
                </div>,
        },

    ], [selectedRoles]); // Dùng useMemo để tránh re-render columns không cần thiết

    // 4. Fetch Data Function
    const fetchData = async () => {
        setIsLoading(true);
        try {
            let filterQuery = "";
            if (debouncedSearch) {
                filterQuery = `fullName=~${debouncedSearch}&email=~${debouncedSearch}`; // Ví dụ cú pháp RSQL/JPA Criteria
            }
            const req: PageRequest = {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort: getSortString(sorting),
                filter: filterQuery || undefined,
            }
            const res = await getUsersList(req)
            setData(res.content)
            console.log(res)
            setIsLoading(false);res.totalElements
        } catch (e) {
            console.error(e);
            toast.error("Failed to load users");
            setData([]);
            setRowCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    // 5. Trigger Fetch khi dependency thay đổi
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize, sorting, debouncedSearch, selectedRoles]);


    // 6. Table Configuration
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
        getRowId: (row) => row.userId,
    });

    // Handle Search Change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({...prev, pageIndex: 1})); // Reset về trang 1 khi tìm kiếm
    };

    const handleBulkBlock = async () => {
        const selectedIds = Object.keys(rowSelection);
        // Lưu ý: Không cần try-catch hay setLoading ở đây nữa
        // vì ConfirmDialog đã lo phần loading UI.
        // Tuy nhiên, ta vẫn cần Promise.all để truyền vào onConfirm

        // Gọi API
        // await Promise.all(selectedIds.map((id) => deleteUser(id)));

        // Thành công thì làm gì tiếp theo:
        toast.success(`Đã khóa ${selectedIds.length} người dùng.`);
        setRowSelection({});
        fetchData();
    };
    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full ">
                <Input
                    placeholder="Search user..."
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
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {(column.columnDef.meta as any)?.label || column.id.replace(/([A-Z])/g, ' $1')}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CreateUserDialog onSuccess={fetchData}/>
                </div>
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Loader className="animate-spin inline-block mr-2"/> Loading data...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Data not found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer Pagination */
            }
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
        </div>);
}

//Create user

const createUserSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.number().min(2, "Please select a role"),

})
type FormValues = z.infer<typeof createUserSchema>

interface CreateUserDialogProps {
    onSuccess: () => void // Để load lại bảng sau khi thêm thành công
}

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export function CreateUserDialog({onSuccess}: CreateUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            role: UserRole.Student,
        },
    })

    async function onSubmit(values: CreateUserFormValues) {
        setIsSubmitting(true)
        try {
            // Simulate API Call
            console.log("Submitting:", values)
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast.success("User created successfully")
            setOpen(false)
            form.reset()
            onSuccess() // Refresh the table data
        } catch (error) {
            toast.error("Failed to create user")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5"/>
                    <span>Add User</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new user to the system.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(UserRole).filter((v) => typeof v === "number").map((role) => (
                                                <SelectItem key={role} value={String(role)}>
                                                    {UserRoleLabel[role as number]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Save user
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}