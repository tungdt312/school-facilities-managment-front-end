import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {BuildingInfoCard} from "@/components/areas/building-info";
import React from "react";
import {RoomInfoCard} from "@/components/areas/room-info";
import {DeviceTable} from "@/components/devices/devices-table";

type PageProps = {
    params: Promise<{ id: string }>
}

// 2. Destructure { params } từ props
export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return (
        <>
            <SiteHeader id={id}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
                        <RoomInfoCard id={id}/>
                        <h2 className="text-lg font-medium text-slate-800">Devices</h2>
                        <DeviceTable locationId={id} />
                    </div>
                </div>
            </div>
        </>
    )
}

function SiteHeader( {id}: { id: string }) {
    return (
        <header
            className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/areas">Areas</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/areas/room/${id}`}>Room Detail [{id}]</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}