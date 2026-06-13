"use client"

import {
  Forward,
  MoreHorizontal,
  Trash2,
  PlusIcon,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import React, { useState } from "react"
import { AddProjectModal } from "@/features/dashboard-project/presentation/components/modals/add-project-modal"
import { DeleteProjectModal } from "@/features/dashboard-project/presentation/components/modals/delete-project-modal"
import { useRouter } from "next/navigation"

export function NavProjects({
  projects,
}: Readonly<{
  projects: {
    id: string
    name: string
    url: string
    icon: LucideIcon
  }[]
}>) {
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)
  const colors = ["bg-[#7AC555]", "bg-[#FFA500]", "bg-[#E4CCFD]", "bg-[#76A5EA]"]

  return (
    <React.Fragment>
      <SidebarGroup className="mt-5 px-0 group-data-[collapsible=icon]:block">
        <div className="mb-2 flex items-center justify-between px-2">
          <SidebarGroupLabel className="px-0 text-[11px] font-bold uppercase tracking-normal text-[#787486]">
            My Projects
          </SidebarGroupLabel>
          <button
            type="button"
            onClick={() => setIsAddProjectModalOpen(true)}
            className="flex h-4 w-4 items-center justify-center rounded border border-[#787486]/60 text-[#787486] transition-colors hover:border-[#5030E5] hover:text-[#5030E5]"
            aria-label="Ajouter un projet"
          >
            <PlusIcon className="h-3 w-3" />
          </button>
        </div>
        <SidebarMenu>
          {projects.map((item, index) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                className="h-10 rounded-md px-2 text-sm font-medium text-[#787486] hover:bg-[#5030E5]/10 hover:text-[#0D062D] data-[active=true]:bg-[#5030E5]/10"
              >
                <a href={item.url}>
                  <span className={`h-2 w-2 rounded-full ${colors[index % colors.length]}`} />
                  <span className="truncate">{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover className="text-[#0D062D]">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(item.url)}>
                    <item.icon className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => setProjectToDelete({ id: item.id, name: item.name })}
                  >
                    <Trash2 className="text-destructive mr-2" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <SidebarMenuButton
              className="mt-1 h-9 rounded-md px-2 text-sm text-[#787486] hover:bg-[#F5F5F7] hover:text-[#0D062D]"
              onClick={() => setIsAddProjectModalOpen(true)}
            >
              <PlusIcon className="text-[#787486]" />
              <span>Ajouter un projet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <AddProjectModal
        open={isAddProjectModalOpen}
        onOpenChange={setIsAddProjectModalOpen}
      />

      <DeleteProjectModal
        open={projectToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProjectToDelete(null)
        }}
        projectId={projectToDelete?.id ?? ""}
        projectName={projectToDelete?.name ?? ""}
      />
    </React.Fragment>
  )
}
