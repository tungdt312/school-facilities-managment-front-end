import {LocationTree} from "@/components/areas/areas-tree"
import {MOCK_BUILDINGS} from "@/components/mock-data/areas-data"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {Menu} from "lucide-react";

export default function Layout({children}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <SiteHeader />
            <div className="flex flex-1 overflow-hidden">

                {/* Persistent Master Tree Section */}
                <aside className="w-fit border-r bg-slate-50/30 overflow-y-auto hidden md:block shrink-0">
                    <div className="p-4">
                        <LocationTree data={MOCK_BUILDINGS} />
                    </div>
                </aside>

                {/* Dynamic Detail Section */}
                <main className="flex-1 overflow-y-auto bg-white">
                    {/* Mobile Floating Trigger: Only visible on small screens */}
                    <div className="md:hidden absolute bottom-6 right-6 z-50">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size="icon" className="rounded-full shadow-lg h-12 w-12">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] p-0">
                                <SheetHeader className="p-4 border-b">
                                    <SheetTitle>Location Structure</SheetTitle>
                                </SheetHeader>
                                <div className="overflow-y-auto h-[calc(100vh-80px)] px-2">
                                    <LocationTree data={MOCK_BUILDINGS} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className="container w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
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
                            <BreadcrumbLink href="/areas">Areas</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}