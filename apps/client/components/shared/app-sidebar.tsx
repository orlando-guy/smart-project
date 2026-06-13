"use client"

import * as React from "react"
import {
  CircleHelp,
  Grid2X2,
  MessageCircle,
  Settings,
  Users,
  ClipboardList,
} from "lucide-react"

import { NavProjects } from "@/components/navigation/nav-project"
import { NavUser } from "@/components/navigation/nav-user"
import { useProjects } from "@/features/dashboard-project/application/hooks/useProjects"
import { Folder } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import DynamicLogo from "@/components/shared/dynamic-logo"

const navItems = [
  { label: "Home", icon: Grid2X2 },
  { label: "Messages", icon: MessageCircle },
  { label: "Tasks", icon: ClipboardList },
  { label: "Members", icon: Users },
  { label: "Settings", icon: Settings },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: projects = [] } = useProjects()

  const mappedProjects = projects.map((project) => ({
    id: project.id,
    name: project.titre,
    url: `/dashboard/project/${project.id}`,
    icon: Folder,
  }))

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[#DBDBDB] bg-white text-[#787486]"
      {...props}
    >
      <SidebarHeader className="h-[68px] border-b border-[#DBDBDB] px-5">
        <DynamicLogo />
      </SidebarHeader>
      <SidebarContent className="px-3 py-5">
        <nav className="space-y-2 border-b border-[#DBDBDB] pb-5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex h-10 items-center gap-3 rounded-md px-2 text-sm font-medium text-[#787486] transition-colors hover:bg-[#F5F5F7] hover:text-[#0D062D]"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <NavProjects projects={mappedProjects} />
        <section className="mx-2 mt-auto rounded-xl bg-[#F5F5F5] px-4 py-5 text-center group-data-[collapsible=icon]:hidden">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FBCB18]/15 text-[#FBCB18]">
            <CircleHelp className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-[#0D062D]">Thoughts Time</p>
          <p className="mt-2 text-xs leading-4 text-[#787486]">
            Partage une note rapide avec ton equipe.
          </p>
          <button className="mt-4 h-9 w-full rounded-md bg-white text-xs font-semibold text-[#0D062D] shadow-sm">
            Write a message
          </button>
        </section>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#DBDBDB] px-3 py-3">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
