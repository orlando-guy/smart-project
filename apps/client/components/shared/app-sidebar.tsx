"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Lightbulb,
  ListTodo,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DynamicLogo from "@/components/shared/dynamic-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useProjects } from "@/features/dashboard-project/application/hooks/useProjects"
import { useDeleteProject } from "@/features/dashboard-project/application/mutations/useDeleteProject"
import { useUpdateProject } from "@/features/dashboard-project/application/mutations/useUpdateProject"
import { Project } from "@/features/dashboard-project/domain/entities/Project"
import {
  ProjectDisplayStatus,
  ProjectFormModal,
} from "@/features/dashboard-project/presentation/components/modals/project-form-modal"
import { useProjectCreateModalStore } from "@/store/useProjectCreateModalStore"
import { useAuthStore } from "@/store/useAuthStore"
import { obtainInitials } from "@/lib/utils"
import { ThoughtMessageModal } from "@/components/shared/thought-message-modal"

const navigationItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Messages", href: "#", icon: MessageCircle },
  { label: "Tasks", href: "#", icon: ListTodo },
  { label: "Members", href: "#", icon: Users },
  { label: "Settings", href: "#", icon: Settings },
]

const defaultProjectColors = ["#7AC555", "#FFA500", "#E4CCFD", "#76A5EA"]
const PROJECT_PREFS_STORAGE_KEY = "smart-project-sidebar-preferences"

type ProjectPreference = {
  color: string
  status: ProjectDisplayStatus
}

type ProjectPreferences = Record<string, ProjectPreference>

function getStoredPreferences(): ProjectPreferences {
  if (typeof localStorage === "undefined") return {}

  try {
    return JSON.parse(localStorage.getItem(PROJECT_PREFS_STORAGE_KEY) ?? "{}")
  } catch {
    return {}
  }
}

function setStoredPreferences(preferences: ProjectPreferences) {
  if (typeof localStorage === "undefined") return
  localStorage.setItem(PROJECT_PREFS_STORAGE_KEY, JSON.stringify(preferences))
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: projects = [] } = useProjects()
  const updateProjectMutation = useUpdateProject()
  const deleteProjectMutation = useDeleteProject()
  const openCreateProjectModal = useProjectCreateModalStore((state) => state.open)
  const currentUser = useAuthStore((state) => state.user)

  const [preferences, setPreferences] = useState<ProjectPreferences>({})
  const [projectToRename, setProjectToRename] = useState<Project | null>(null)
  const [isThoughtModalOpen, setIsThoughtModalOpen] = useState(false)

  useEffect(() => {
    setPreferences(getStoredPreferences())
  }, [])

  const projectColorById = useMemo(() => {
    return projects.reduce<Record<string, string>>((acc, project, index) => {
      acc[project.id] = preferences[project.id]?.color ?? defaultProjectColors[index % defaultProjectColors.length]
      return acc
    }, {})
  }, [preferences, projects])

  function saveProjectPreference(projectId: string, preference: ProjectPreference) {
    const nextPreferences = {
      ...preferences,
      [projectId]: preference,
    }

    setPreferences(nextPreferences)
    setStoredPreferences(nextPreferences)
  }

  function removeProjectPreference(projectId: string) {
    const nextPreferences = { ...preferences }
    delete nextPreferences[projectId]
    setPreferences(nextPreferences)
    setStoredPreferences(nextPreferences)
  }

  function handleRenameProject(values: { title: string; description: string; color: string; status: ProjectDisplayStatus }) {
    if (!projectToRename) return

    updateProjectMutation.mutate(
      {
        id: projectToRename.id,
        data: {
          title: values.title,
          description: values.description,
        },
      },
      {
        onSuccess: () => {
          saveProjectPreference(projectToRename.id, {
            color: values.color,
            status: values.status,
          })
          toast.success("Projet renomme avec succes.")
          setProjectToRename(null)
        },
        onError: () => {
          toast.error("Impossible de renommer le projet.")
        },
      }
    )
  }

  function handleDeleteProject(project: Project) {
    const shouldDelete = window.confirm(`Supprimer le projet "${project.titre}" ? Cette action est irreversible.`)
    if (!shouldDelete) return

    deleteProjectMutation.mutate(project.id, {
      onSuccess: () => {
        removeProjectPreference(project.id)
        toast.success("Projet supprime avec succes.")

        if (pathname === `/dashboard/project/${project.id}`) {
          router.push("/dashboard")
        }
      },
      onError: () => {
        toast.error("Impossible de supprimer le projet.")
      },
    })
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-[#DBDBDB] bg-white" {...props}>
      <SidebarHeader className="border-b border-[#DBDBDB] px-4 py-5">
        <DynamicLogo brandName="Smart Project" />
      </SidebarHeader>

      <SidebarContent className="bg-white px-4 py-5">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href !== "#" && pathname === item.href

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#5030E5]/10 text-[#0D062D]"
                    : "text-[#787486] hover:bg-[#F5F5F5] hover:text-[#0D062D]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="my-6 h-px bg-[#DBDBDB]" />

        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold uppercase text-[#787486]">My Projects</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#787486]"
              onClick={openCreateProjectModal}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Creer un projet</span>
            </Button>
          </div>

          <div className="space-y-1">
            {projects.length === 0 ? (
              <p className="px-3 py-2 text-xs leading-5 text-[#787486]">
                Aucun projet pour le moment.
              </p>
            ) : (
              projects.map((project) => {
                const href = `/dashboard/project/${project.id}`
                const isActive = pathname === href

                return (
                  <div
                    key={project.id}
                    className={`group flex items-center rounded-md pr-1 transition-colors ${
                      isActive
                        ? "bg-[#5030E5]/10 text-[#0D062D]"
                        : "text-[#787486] hover:bg-[#F5F5F5] hover:text-[#0D062D]"
                    }`}
                  >
                    <Link
                      href={href}
                      className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-sm font-medium"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: projectColorById[project.id] }}
                      />
                      <span className="min-w-0 flex-1 truncate">{project.titre}</span>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#0D062D] opacity-100 hover:bg-white md:opacity-0 md:group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu projet</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-lg">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => setProjectToRename(project)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Renommer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => handleDeleteProject(project)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </SidebarContent>

      <SidebarFooter className="bg-white p-4">
        {currentUser && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white px-2 py-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#5030E5] text-white">
                {obtainInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-[#0D062D]">{currentUser.name}</p>
              <p className="truncate text-xs text-[#787486]">{currentUser.email}</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-[#F5F5F5] px-4 py-5 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FCD64A]/20 text-[#FBCB18]">
            <Lightbulb className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#0D062D]">Thoughts Time</h3>
          <p className="mt-3 text-xs leading-5 text-[#787486]">
            We do not have any notice for you. Share your thoughts with your peers.
          </p>
          <Button
            className="mt-4 h-10 w-full bg-white text-sm font-medium text-[#0D062D] hover:bg-white/90"
            onClick={() => setIsThoughtModalOpen(true)}
          >
            Write a message
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />

      <ProjectFormModal
        mode="rename"
        open={projectToRename !== null}
        onOpenChange={(open) => {
          if (!open) setProjectToRename(null)
        }}
        initialValues={{
          title: projectToRename?.titre ?? "",
          description: projectToRename?.description ?? "",
          color: projectToRename ? projectColorById[projectToRename.id] : defaultProjectColors[0],
          status: projectToRename ? preferences[projectToRename.id]?.status ?? "active" : "active",
        }}
        isPending={updateProjectMutation.isPending}
        onSubmit={handleRenameProject}
      />

      <ThoughtMessageModal
        open={isThoughtModalOpen}
        onOpenChange={setIsThoughtModalOpen}
      />
    </Sidebar>
  )
}
