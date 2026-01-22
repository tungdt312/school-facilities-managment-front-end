"use client"

import * as React from "react"
import {
  IconBuildingCog,
  IconBuildingCommunity, IconBusinessplan,
  IconClipboardData,
  IconDashboard,
  IconDevices,
  IconDevicesCog,
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
import {useCurrentUser} from "@/hooks/use-user";
import {UserRole, UserRoleLabel} from "@/constaints/enum";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
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
      url: "/user",
      icon: IconDashboard,
    },
    {
      title: "Devices Borrow",
      url: "/user/borrow",
      icon: IconFile3d
    },
    {
      title: "Room Booking",
      url: "/user/booking",
      icon: IconFileTime
    },
    {
      title: "Devices Maintenance",
      url: "/user/maintenance",
      icon: IconDevicesCog
    },
    {
      title: "Devices Repair",
      url: "/user/repair",
      icon: IconTool
    },
  ],
  employeeMain: [
    {
      title: "Dashboard",
      url: "/user",
      icon: IconDashboard,
    },
    {
      title: "Devices Transfer",
      url: "/user/transfer",
      icon: IconTransfer
    },
    {
      title: "Devices Borrow",
      url: "/user/borrow",
      icon: IconFile3d
    },
    {
      title: "Room Booking",
      url: "/user/booking",
      icon: IconFileTime
    },
    {
      title: "Devices Maintenance",
      url: "/user/maintenance",
      icon: IconDevicesCog
    },
    {
      title: "Devices Repair",
      url: "/user/repair",
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
      name: "Devices Borrow",
      url: "/borrow",
      icon: IconFile3d
    },
    {
      name: "Room Booking",
      url: "/booking",
      icon: IconFileTime
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
  const {role, fullname, email} = useCurrentUser()
  console.log(fullname, email, role)
  if (role === undefined) return;
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
        {role === UserRole.DepartmentHead && <NavMain items={data.navMain}/>}
        {role === UserRole.DepartmentHead && <NavDocuments name={"User Management"} items={data.users}/>}
        {(role === UserRole.DepartmentHead || role === UserRole.FacilityManager) && <NavDocuments name={"Facilites Management"} items={data.managements}/>}
        {(role === UserRole.DepartmentHead || role === UserRole.FacilityManager) && <NavDocuments name={"Other Management"} items={data.other}/>}
        {(role === UserRole.Student || role === UserRole.Lecturer) && <NavMain items={data.userMain}/>}

        {role === UserRole.Department &&<NavMain items={data.employeeMain}/>}


        {/*<NavSecondary items={data.navSecondary} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser fullname={fullname || "user"} email={email || "email@gmail.com"} />
      </SidebarFooter>
    </Sidebar>
  )
}
