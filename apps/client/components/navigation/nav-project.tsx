"use client"

import {
  Folder,
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

  return (
    <React.Fragment>
      <SidebarGroup className="group-data-[collapsible=icon]:block">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          {projects.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(item.url)}>
                    <Folder className="text-muted-foreground" />
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
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/70"
              onClick={() => setIsAddProjectModalOpen(true)}
            >
              <PlusIcon className="text-sidebar-foreground/70" />
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
