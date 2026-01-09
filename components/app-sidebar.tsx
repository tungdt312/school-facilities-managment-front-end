"use client"

import * as React from "react"
import {
  IconBuildingCommunity,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase, IconDevices, IconDevicesCog, IconDots, IconFile3d,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings, IconTool, IconTransfer, IconTransferIn, IconTransferOut,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
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
      url: "#",
      icon: IconDashboard,
    },
  ],
  userMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Borrow",
      url: "#",
      icon: IconFile3d
    },
    {
      title: "Maintenance",
      url: "#",
      icon: IconDevicesCog
    },
    {
      title: "Repair",
      url: "#",
      icon: IconTool
    },
  ],
  employeeMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Devices Transfer",
      url: "#",
      icon: IconTransfer
    },
    {
      title: "Borrow",
      url: "#",
      icon: IconFile3d
    },
    {
      title: "Maintenance",
      url: "#",
      icon: IconDevicesCog
    },
    {
      title: "Repair",
      url: "#",
      icon: IconTool
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  users: [
    {
      name: "Users",
      url: "#",
      icon: IconUsers
    },
  ],
  managements:[
    {
      name: "Areas",
      url: "#",
      icon: IconBuildingCommunity
    },
    {
      name: "Devices",
      url: "#",
      icon: IconDevices
    },
    {
      name: "Devices Procurement",
      url: "#",
      icon: IconTransferIn
    },
    {
      name: "Devices Disposal",
      url: "#",
      icon: IconTransferOut
    },
    {
      name: "Devices Transfer",
      url: "#",
      icon: IconTransfer
    },
    {
      name: "Borrow",
      url: "#",
      icon: IconFile3d
    },
    {
      name: "Maintenance",
      url: "#",
      icon: IconDevicesCog
    },
    {
      name: "Repair",
      url: "#",
      icon: IconTool
    },
    {
      name: "More",
      url: "#",
      icon: IconDots
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
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
        <NavMain items={data.userMain} />
        <NavMain items={data.employeeMain} />
        <NavDocuments name={"User Management"} items={data.users} />
        <NavDocuments name={"Facilites Management"} items={data.managements} />
        {/*<NavSecondary items={data.navSecondary} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
