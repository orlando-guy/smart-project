"use client"

import { useMemo } from "react"
import { CalendarDaysIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ProjectTask } from "@/features/dashboard-project/domain/entities/Project"

type ProjectDetailResponse = {
  data: {
    tasks?: ProjectTask[]
  }
}

type CalendarTasksDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
}

function formatDate(date: ProjectTask["endDate"]) {
  if (!date) return "Sans date"

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function CalendarTasksDrawer({
  open,
  onOpenChange,
  projectId,
}: Readonly<CalendarTasksDrawerProps>) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["calendar-project-tasks", projectId],
    enabled: open && Boolean(projectId),
    queryFn: async () => {
      const response = await api.get<ProjectDetailResponse>(`/project/${projectId}`)
      return response.data.data.tasks ?? []
    },
  })

  const tasks = useMemo(() => {
    return [...(data ?? [])].sort((a, b) => {
      if (!a.endDate && !b.endDate) return a.title.localeCompare(b.title)
      if (!a.endDate) return 1
      if (!b.endDate) return -1
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    })
  }, [data])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-[#ECECF2]">
          <SheetTitle className="flex items-center gap-2 text-[#0D062D]">
            <CalendarDaysIcon className="h-5 w-5 text-[#5030E5]" />
            Calendrier des taches
          </SheetTitle>
          <SheetDescription>
            Taches du projet classees par date d&apos;echeance.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {!projectId && (
            <div className="rounded-xl bg-[#F5F5F5] p-4 text-sm text-[#787486]">
              Ouvrez un projet pour afficher ses taches dans le calendrier.
            </div>
          )}

          {projectId && isLoading && (
            <p className="text-sm text-[#787486]">Chargement des taches...</p>
          )}

          {projectId && error && (
            <p className="text-sm text-destructive">
              Impossible de charger les taches du projet.
            </p>
          )}

          {projectId && !isLoading && !error && tasks.length === 0 && (
            <div className="rounded-xl bg-[#F5F5F5] p-4 text-sm text-[#787486]">
              Aucune tache avec echeance pour ce projet.
            </div>
          )}

          {tasks.length > 0 && (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <article
                  key={`${task.title}-${index}`}
                  className="rounded-xl border border-[#ECECF2] bg-white p-4 shadow-[0_6px_18px_rgba(13,6,45,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase text-[#787486]">
                        {formatDate(task.endDate)}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-[#0D062D]">
                        {task.title}
                      </h3>
                    </div>
                    <span className="rounded bg-[#5030E5]/10 px-2 py-1 text-xs font-medium text-[#5030E5]">
                      {task.statut}
                    </span>
                  </div>
                  {task.description && (
                    <p className="mt-2 text-xs leading-5 text-[#787486]">
                      {task.description}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-[#787486]">
                    Assigne a {task.assignedUser.name}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
