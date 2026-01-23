import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb";
import {ImportRequestTable} from "@/components/procurement/procurement-request-table";
import {LiquidateRequestTable} from "@/components/disposals/disposals-request-table";
import {TransferRequestTable} from "@/components/transfer/transfer-request-table";
import {MaintenanceRequestTable} from "@/components/maintenance/MaintenanceRequestTable";
import {InventoryAuditTable} from "@/components/audit/InventoryAuditTable";
import {RepairRequestTable} from "@/components/repair/RepairRequestTable";
import {MainDashboard} from "@/components/statistic/main";

export default function Page() {
    return (
        <>
            <SiteHeader/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
                        <span>Procurement Requests</span>
                        <ImportRequestTable/>
                        <span>Disposal Requests</span>
                        <LiquidateRequestTable/>
                        <span>Transfer Requests</span>
                        <TransferRequestTable/>
                        <span>Maintenance Requests</span>
                        <MaintenanceRequestTable/>
                        <span>Repair Requests</span>
                        <RepairRequestTable/>
                        <span>Inventory Audit</span>
                        <InventoryAuditTable/>
                        <MainDashboard/>
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
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}