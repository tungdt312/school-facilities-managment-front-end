"use client"
import { useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { RepairTable } from "@/components/repair/RepairTable";
import { RepairRequestTable } from "@/components/repair/RepairRequestTable";
import { RepairVoucherDetail } from "@/components/repair/RepairVoucherDetail";
import { RepairRequestDetail } from "@/components/repair/RepairRequestDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");
    const detailParam = searchParams.get("detail");
    const defaultTab = tabParam === "requests" ? "requests" : "vouchers";

    return (
        <>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
                        {detailParam ? (
                            <div>
                                {tabParam === "requests" ? (
                                    <RepairRequestDetail id={detailParam} />
                                ) : (
                                    <RepairVoucherDetail id={detailParam} />
                                )}
                            </div>
                        ) : (
                            <Tabs defaultValue={defaultTab} className="w-full">
                                <TabsList className="grid w-full max-w-md grid-cols-2">
                                    <TabsTrigger value="vouchers">Repair Vouchers</TabsTrigger>
                                    <TabsTrigger value="requests">Repair Requests</TabsTrigger>
                                </TabsList>
                                <TabsContent value="vouchers">
                                    <RepairTable />
                                </TabsContent>
                                <TabsContent value="requests">
                                    <RepairRequestTable />
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

function SiteHeader() {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/repair">Devices Repair</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}