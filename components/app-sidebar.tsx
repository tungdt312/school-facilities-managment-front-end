"use client"

import * as React from "react"
import {
  IconBuildingCog,
  IconBuildingCommunity, IconBusinessplan,
  IconClipboardData,
  IconDashboard,
  IconDevices,
  IconDevicesCog,
  IconDots,
  IconFile3d, IconFileTime,
  IconInnerShadowTop, IconReportMoney, IconTie,
  IconTool,
  IconTransfer,
  IconTransferIn,
  IconTransferOut,
  IconUsers,
} from "@tabler/icons-react"

import {NavDocuments} from "@/components/nav-documents"
import {NavMain} from "@/components/nav-main"
import {NavUser} from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ],
  userMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Borrow",
      url: "/borrow",
      icon: IconFile3d
    },
    {
      title: "Maintenance",
      url: "/maintenance",
      icon: IconDevicesCog
    },
    {
      title: "Repair",
      url: "/repair",
      icon: IconTool
    },
  ],
  employeeMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Devices Transfer",
      url: "/transfer",
      icon: IconTransfer
    },
    {
      title: "Borrow",
      url: "/borrow",
      icon: IconFile3d
    },
    {
      title: "Devices Maintenance",
      url: "/maintenance",
      icon: IconDevicesCog
    },
    {
      title: "Devices Repair",
      url: "/repair",
      icon: IconTool
    },
  ],
  users: [
    {
      name: "Users",
      url: "/users",
      icon: IconUsers
    },
  ],
  managements:[
    {
      name: "Areas",
      url: "/areas",
      icon: IconBuildingCommunity
    },
    {
      name: "Devices",
      url: "/devices",
      icon: IconDevices
    },
    {
      name: "Devices Procurement",
      url: "/procurement",
      icon: IconTransferIn
    },
    {
      name: "Devices Disposal",
      url: "/disposal",
      icon: IconTransferOut
    },
    {
      name: "Devices Transfer",
      url: "/transfer",
      icon: IconTransfer
    },
    {
      name: "Borrow",
      url: "/borrow",
      icon: IconFile3d
    },
    {
      name: "Devices Maintenance",
      url: "/maintenance",
      icon: IconDevicesCog
    },
    {
      name: "Devices Repair",
      url: "/repair",
      icon: IconTool
    },
    {
      name: "Devices Audit",
      url: "/audit",
      icon: IconClipboardData
    },
  ],
  other:[
    {
      name: "Fund Sources",
      url: "/fund-sources",
      icon: IconBusinessplan
    },
    {
      name: "Invoices",
      url: "/invoices",
      icon: IconReportMoney
    },
    {
      name: "External Units",
      url: "/external-units",
      icon: IconTie
    },
    {
      name: "Room Types",
      url: "/room-types",
      icon: IconBuildingCog
    },
    {
      name: "Devices Types",
      url: "/device-types",
      icon: IconDevicesCog
    },
    {
      name: "Periodic Audit",
      url: "/periodic-audit",
      icon: IconFileTime
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Department of Facilities Management</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavMain items={data.userMain} />*/}
        {/*<NavMain items={data.employeeMain} />*/}
        <NavDocuments name={"User Management"} items={data.users} />
        <NavDocuments name={"Facilites Management"} items={data.managements} />
        <NavDocuments name={"Other Management"} items={data.other} />
        {/*<NavSecondary items={data.navSecondary} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
