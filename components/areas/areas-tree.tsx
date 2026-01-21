"use client"

import React, {useEffect, useState} from "react"
import Link from "next/link"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Building2, DoorOpen, Layers} from "lucide-react"
import {BuildingResponse} from "@/dtos/building"
import {toast} from "sonner";
import {getBuildingsList} from "@/services/areaService";

interface LocationTreeProps {
    data: BuildingResponse[]
}

export function LocationTree() {
    const [data, setData] = useState<BuildingResponse[]>([])
    const fetchData = async () => {
        try {
            const res = await getBuildingsList()
            setData(res.content)
            console.log(res)
        } catch (e) {
            console.error(e);
            toast.error("Failed to load buildings");
            setData([]);
        }
    }
    useEffect(() => {
        fetchData()
    },[])
    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-medium text-slate-800">Location Structure</h2>
                <p className="text-sm text-muted-foreground font-medium">Buildings - Floors - Rooms</p>
            </div>

            <Accordion type="multiple" className="w-full space-y-1">
                {data.map((building) => (
                    <AccordionItem key={building.buildingId} value={building.buildingId} className="border-none">
                        <div className="flex items-center group rounded-lg hover:bg-slate-50 transition-all">
                            {/* NAVIGATION LINK */}
                            <Link
                                href={`/areas/building/${building.buildingId}`}
                                className="flex flex-1 items-center justify-between py-3 px-3 outline-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Building2 className="size-5" />
                                    </div>
                                    <span className="font-semibold text-slate-700 text-sm">{building.buildingName}</span>
                                </div>
                                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-500 font-semibold ml-1">
                                    {building.floorCount} floors
                                </span>
                            </Link>

                            {/* TOGGLE TRIGGER ONLY */}
                            <AccordionTrigger className="w-10 h-10 p-0 flex items-center justify-center hover:bg-slate-200/50 rounded-r-lg transition-colors [&[data-state=open]>svg]:rotate-180">
                                {/* The Chevron is built into Shadcn's AccordionTrigger by default */}
                            </AccordionTrigger>
                        </div>

                        <AccordionContent className="pt-1 pb-0 ml-7 border-l-2 border-slate-100 pl-4">
                            <Accordion type="multiple" className="w-full space-y-1">
                                {building.floors.map((floor) => (
                                    <AccordionItem key={floor.floorId} value={floor.floorId} className="border-none">
                                        <div className="flex items-center group/floor rounded-lg hover:bg-slate-50 transition-all">
                                            {/* FLOOR NAVIGATION LINK */}
                                            <Link
                                                href={`/areas/floor/${floor.floorId}`}
                                                className="flex flex-1 items-center justify-between py-2.5 px-3"
                                            >
                                                <div className="flex items-center gap-3 text-slate-600 group-hover/floor:text-primary transition-colors">
                                                    <Layers className="size-4" />
                                                    <span className="text-sm font-medium">{floor.floorName}</span>
                                                </div>
                                                <span className="text-[10px]  font-bold text-slate-400 mr-2">
                                                    {floor.roomCount} rooms
                                                </span>
                                            </Link>

                                            {/* FLOOR TOGGLE TRIGGER */}
                                            <AccordionTrigger className="w-8 h-8 p-0 flex items-center justify-center hover:bg-slate-200/50 rounded-lg transition-colors [&[data-state=open]>svg]:rotate-180" />
                                        </div>

                                        <AccordionContent className="pt-1 pb-3 ml-3 border-l-2 border-slate-50 pl-5 space-y-2">
                                            {floor.rooms.map((room) => (
                                                <Link
                                                    key={room.roomId}
                                                    href={`/areas/room/${room.roomId}`}
                                                    className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-slate-50/50 hover:bg-primary/5 group cursor-pointer border border-transparent hover:border-primary/10 transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <DoorOpen className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
                                                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                                                            {room.roomName}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}