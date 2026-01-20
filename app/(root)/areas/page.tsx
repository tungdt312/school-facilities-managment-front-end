import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb";
import {LocationTree} from "@/components/areas/areas-tree";
import {MOCK_BUILDINGS} from "@/components/mock-data/areas-data";
import {BuildingTable} from "@/components/areas/buildings-table";

export default function Page() {
    return (
        <>
            <SiteHeader/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col w-full gap-4 py-4 md:gap-6 md:py-6 px-6 shrink-0">
                        <BuildingTable />
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
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/areas">Areas</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}