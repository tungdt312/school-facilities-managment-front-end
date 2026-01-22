"use client"

import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Activity,
    Building2,
    Calendar,
    DollarSign,
    DoorOpen,
    FileText,
    Globe,
    Layers,
    Loader2,
    MapPin,
    Monitor,
    Pencil,
    Save,
    Tag,
    X
} from 'lucide-react'
import {toast} from 'sonner'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {DeviceResponse} from "@/dtos/device"
import {DeviceStatus, DeviceStatusLabel, LocationType} from "@/constaints/enum"
import {getDeviceById, putDevice} from "@/services/deviceService";
import {BuildingResponse, RoomResponse} from "@/dtos/building";
import {getBuildingsList, getRoomsList} from "@/services/areaService";

const deviceSchema = z.object({
    equipmentName: z.string().min(1, "Equipment name is required"),
    categoryId: z.string().min(1, "Category is required"),
    locationId: z.string().min(1, "Location is required"),
    locationType: z.number().min(1, "Location is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Price cannot be negative"),
    isPublic: z.boolean(),
    status: z.number().min(1, "Status is required"),
    description: z.string().optional(),
    warrantyExpiryDate: z.string().optional(),
})

type DeviceFormValues = z.infer<typeof deviceSchema>

export function DeviceInfoCard({id}: { id: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [device, setDevice] = useState<DeviceResponse | undefined>(undefined)
    const [buildings, setBuildings] = useState<BuildingResponse[]>([])
    const form = useForm<DeviceFormValues>({
        resolver: zodResolver(deviceSchema),
        defaultValues: {
            equipmentName: "",
            categoryId: "",
            locationId: "",
            locationType: LocationType.Room,
            unitPrice: 0,
            isPublic: false,
            status: DeviceStatus.Available,
            description: "",
            warrantyExpiryDate: "",
        },
    })
    const fetchLocation = async () => {
        try {
            const res = await getBuildingsList({page: 1, size: 100})
            setBuildings(res.content)
        } catch (e) {
            console.error(e);
            toast.error("Failed to load buildings");
        }

    }
    useEffect(() => {
        fetchLocation()
    }, [])
    useEffect(() => {
        const fetchDevice = async () => {
            try {
                setLoading(true)
                const res = await getDeviceById(id)
                setDevice(res)
                form.reset({
                    ...res,
                    isPublic: true,
                    warrantyExpiryDate: res.warrantyExpiryDate?.split('T')[0] // Format cho input date
                })
            } catch (e) {
                toast.error("Failed to fetch device")
            } finally {
                setLoading(false)
            }

        }
        fetchDevice()
    }, [id, form])

    const onSubmit = async (values: DeviceFormValues) => {
        setLoading(true)
        try {
            console.log("Submit Update Device:", values)
            const res = await putDevice(values, id)
            toast.success("Device updated successfully")
            setIsEditing(false)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2
        className="animate-spin h-8 w-8 text-primary"/></div>
    if (!device) return <div className="p-4 text-center">Device not found</div>

    return (
        <Card className="w-full mx-auto border-muted/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <CardTitle className="font-semibold flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary"/> Device Detail [{id}]
                </CardTitle>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Pencil className="h-4 w-4 mr-2"/> Edit Info
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => {
                            form.reset();
                            setIsEditing(false)
                        }} className="text-destructive">
                            <X className="h-4 w-4 mr-1"/> Cancel
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col gap-8 lg:flex-row">
                            {/* Left Visual Section */}
                            <div
                                className="flex flex-col items-center gap-4 lg:w-1/4 border-b lg:border-b-0 lg:border-r pb-6 lg:pb-0 lg:pr-6">
                                <div
                                    className="h-28 w-28 rounded-2xl bg-primary/10 flex items-center justify-center border-4 border-primary/5 shadow-sm">
                                    <Monitor className="h-14 w-14 text-primary"/>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        <span
                                            className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                                            {device.categoryName}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-xl leading-tight">{form.watch("equipmentName")}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                        {device.locationType == LocationType.Building &&
                                            <Building2 className="size-3 text-muted-foreground"/>}
                                        {device.locationType == LocationType.Floor &&
                                            <Layers className="size-3 text-muted-foreground"/>}
                                        {device.locationType == LocationType.Room &&
                                            <DoorOpen className="size-3 text-muted-foreground"/>}
                                        {device.locationName}
                                    </p>
                                </div>
                            </div>

                            {/* Right Form Fields */}
                            <div className="flex-1 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    {/* Name */}
                                    <FormField control={form.control} name="equipmentName" render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><Monitor
                                                className="h-3.5 w-3.5"/> Equipment Name</FormLabel>
                                            <FormControl><Input {...field} disabled={!isEditing}
                                                                className={!isEditing ? "bg-muted/50" : ""}/></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/* Status */}
                                    <FormField control={form.control} name="status" render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><Activity
                                                className="h-3.5 w-3.5"/> Status</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value?.toString()} disabled={!isEditing}>
                                                <FormControl><SelectTrigger className={!isEditing ? "bg-muted/50" : ""}><SelectValue/></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {Object.values(DeviceStatus).map(s => <SelectItem key={s}
                                                                                                      value={s.toString()}>{DeviceStatusLabel[s as number]}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/* Category */}
                                    <FormField control={form.control} name="categoryId" render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><Tag
                                                className="h-3.5 w-3.5"/> Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}
                                                    disabled={!isEditing}>
                                                <FormControl><SelectTrigger className={!isEditing ? "bg-muted/50" : ""}><SelectValue
                                                    placeholder="Select category"/></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CAT-001">Laptop</SelectItem>
                                                    <SelectItem value="CAT-002">Monitor</SelectItem>
                                                    <SelectItem value="CAT-003">Projector</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/* Location */}
                                    <FormField control={form.control} name="locationId" render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><MapPin
                                                className="h-3.5 w-3.5"/> Location</FormLabel>
                                            <Select
                                                onValueChange={(combinedValue) => {
                                                    const [type, id] = combinedValue.split("|");

                                                    form.setValue("locationId", id);
                                                    form.setValue("locationType", Number(type));

                                                    form.trigger(["locationId", "locationType"]);
                                                }}
                                                defaultValue={field.value}>
                                                <FormControl><SelectTrigger className="bg-white w-full"><SelectValue placeholder="From..." /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {buildings.map(building => (
                                                        <SelectGroup key={building.buildingId}>
                                                            {/* Mục chọn cho chính tòa nhà */}
                                                            <SelectItem value={`${LocationType.Building}|${building.buildingId}`} className="font-medium">
                                                                {building.buildingName}
                                                            </SelectItem>

                                                            {building.floors?.map(floor => (
                                                                <React.Fragment key={floor.floorId}>
                                                                    {/* Mục chọn cho tầng */}
                                                                    <SelectItem value={`${LocationType.Floor}|${floor.floorId}`} className="pl-6 italic">
                                                                        {floor.floorName}
                                                                    </SelectItem>

                                                                    {/* Mục chọn cho phòng */}
                                                                    {floor.rooms?.map(room => (
                                                                        <SelectItem key={room.roomId} value={`${LocationType.Room}|${room.roomId}`} className="pl-12">
                                                                            {room.roomName}
                                                                        </SelectItem>
                                                                    ))}
                                                                </React.Fragment>
                                                            ))}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/* Price */}
                                    <FormField control={form.control} name="unitPrice" render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><DollarSign
                                                className="h-3.5 w-3.5"/> Unit Price</FormLabel>
                                            <FormControl><Input type="number" {...field} disabled={!isEditing}
                                                                className={!isEditing ? "bg-muted/50" : ""}/></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/* Warranty Date */}
                                    <FormField control={form.control} name="warrantyExpiryDate" render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><Calendar
                                                className="h-3.5 w-3.5"/> Warranty Expiry</FormLabel>
                                            <FormControl><Input type="date" {...field} disabled={!isEditing}
                                                                className={!isEditing ? "bg-muted/50" : ""}/></FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/* isPublic Checkbox */}
                                    <FormField control={form.control} name="isPublic" render={({field}) => (
                                        <FormItem
                                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange}
                                                          disabled={!isEditing}/>
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <Globe className="h-3.5 w-3.5"/> Public Visibility
                                                </FormLabel>
                                                <FormDescription className="text-[11px]">
                                                    Allow this device to be viewed by all users.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}/>
                                </div>

                                {/* Description */}
                                <FormField control={form.control} name="description" render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2"><FileText
                                            className="h-3.5 w-3.5"/> Description</FormLabel>
                                        <FormControl><Input {...field} disabled={!isEditing}
                                                            className={!isEditing ? "bg-muted/50" : ""}/></FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                                {isEditing && (
                                    <div className="flex justify-end pt-4 border-t">
                                        <Button type="submit" disabled={loading} className="gap-2 px-8">
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                                <Save className="h-4 w-4"/>}
                                            Save Device Changes
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}