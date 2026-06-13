"use client"

import React from "react"
import { useSingleProject } from "../../application/hooks/useSingleProject"
import {
  CalendarDays,
  FileText,
  FilterIcon,
  Grid2X2,
  Link2Icon,
  MessageSquare,
  MoreHorizontal,
  PencilIcon,
  PlusIcon,
  Share2,
  Users,
} from "lucide-react"
import { GenericDropdown } from "@/components/dropdown/generic-dropdown"
import { Button } from "@/components/ui/button"

interface ProjectPresentationDetailViewProps {
  projectId: string
}

type TaskStatus = "NOT_STARTED" | "ONGOING" | "ACHIEVED"
type ProjectPriority = "MUST" | "SHOULD" | "COULD" | "WONT"

const columns: {
  status: TaskStatus
  title: string
  color: string
  line: string
}[] = [
  { status: "NOT_STARTED", title: "To Do", color: "bg-[#5030E5]", line: "bg-[#5030E5]" },
  { status: "ONGOING", title: "On Progress", color: "bg-[#FFA500]", line: "bg-[#FFA500]" },
  { status: "ACHIEVED", title: "Done", color: "bg-[#8BC48A]", line: "bg-[#8BC48A]" },
]

const priorityStyle: Record<ProjectPriority, string> = {
  MUST: "bg-[#FFDADA] text-[#D8727D]",
  SHOULD: "bg-[#FFEFD7] text-[#D58D49]",
  COULD: "bg-[#DFA874]/20 text-[#D58D49]",
  WONT: "bg-[#E6F3EB] text-[#68B266]",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function getPriorityLabel(priority: ProjectPriority) {
  if (priority === "MUST") return "High"
  if (priority === "WONT") return "Completed"
  return "Low"
}

const ProjectPresentationDetailView = ({
  projectId,
}: Readonly<ProjectPresentationDetailViewProps>) => {
  const { results, isLoading, error } = useSingleProject(projectId)

  if (isLoading) {
    return (
      <div className="px-5 py-8 md:px-9">
        <p className="text-sm text-[#787486]">Loading...</p>
      </div>
    )
  }

  if (error) {
    console.error(error.message)
    return (
      <div className="px-5 py-8 md:px-9">
        <p className="text-sm text-red-500">{error.message}</p>
      </div>
    )
  }

  const tasks = results?.tasks ?? []
  const members = results?.teams?.map((team) => team.user) ?? []

  return (
    <div className="min-h-[calc(100vh-68px)] px-5 py-9 md:px-9">
      <section className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="max-w-full truncate text-4xl font-bold tracking-normal text-[#0D062D] md:text-[46px]">
              {results?.titre}
            </h1>
            <div className="flex items-center gap-3">
              <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[#5030E5]/10 text-[#5030E5]">
                <PencilIcon className="h-4 w-4" />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[#5030E5]/10 text-[#5030E5]">
                <Link2Icon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#787486]">
            {results?.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <Button
            variant="link"
            className="h-8 gap-2 px-0 text-[#5030E5]"
            onClick={() => alert("add a new member")}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded bg-[#5030E5]/10">
              <PlusIcon className="h-3 w-3" />
            </span>
            Invite
          </Button>
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((member, index) => (
              <div
                key={member.id}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white"
                style={{
                  backgroundColor: ["#F9A86E", "#7AC555", "#76A5EA", "#DFA874", "#F3AFC0"][index % 5],
                }}
                title={member.name}
              >
                {getInitials(member.name)}
              </div>
            ))}
            {members.length > 5 && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#F4D7DA] text-xs font-semibold text-[#D25B68]">
                +{members.length - 5}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <GenericDropdown
            triggerLabel="Filter"
            triggerClassName="h-10 w-fit border-[#787486]/60 text-[#787486] text-sm px-4 cursor-pointer rounded-md"
            triggerLeftIcon={<FilterIcon className="h-4 w-4" />}
          >
            <GenericDropdown.Group>
              <GenericDropdown.Item>Date de creation</GenericDropdown.Item>
              <GenericDropdown.Item>Haute priorite</GenericDropdown.Item>
              <GenericDropdown.Item>Priorite moyenne</GenericDropdown.Item>
            </GenericDropdown.Group>
          </GenericDropdown>

          <GenericDropdown
            triggerLabel="Today"
            triggerClassName="h-10 w-fit border-[#787486]/60 text-[#787486] text-sm px-4 cursor-pointer rounded-md"
            triggerLeftIcon={<CalendarDays className="h-4 w-4" />}
          >
            <GenericDropdown.Group>
              <GenericDropdown.Item>Aujourd'hui</GenericDropdown.Item>
              <GenericDropdown.Item>Cette semaine</GenericDropdown.Item>
              <GenericDropdown.Item>Ce mois</GenericDropdown.Item>
            </GenericDropdown.Group>
          </GenericDropdown>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-10 gap-2 rounded-md border-[#787486]/60 px-4 text-[#787486]">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <span className="h-7 w-px bg-[#787486]/40" />
          <button className="flex h-10 w-10 items-center justify-center rounded-md bg-[#5030E5] text-white">
            <Grid2X2 className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-md text-[#787486] hover:bg-[#F5F5F7]">
            <MoreHorizontal className="h-5 w-5 rotate-90" />
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.statut === column.status)

          return (
            <div key={column.status} className="min-h-[520px] rounded-2xl bg-[#F5F5F5] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${column.color}`} />
                  <h2 className="text-sm font-semibold text-[#0D062D]">{column.title}</h2>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E0E0E0] px-1.5 text-xs font-medium text-[#625F6D]">
                    {columnTasks.length}
                  </span>
                </div>
                {column.status === "NOT_STARTED" && (
                  <button className="flex h-5 w-5 items-center justify-center rounded bg-[#5030E5]/10 text-[#5030E5]">
                    <PlusIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className={`mb-5 h-[3px] rounded-full ${column.line}`} />

              <div className="space-y-4">
                {columnTasks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#DADADA] bg-white/60 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-[#0D062D]">Aucune tache</p>
                    <p className="mt-1 text-xs text-[#787486]">Les taches de ce statut apparaitront ici.</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <article
                      key={`${task.title}-${task.assignedUser.id}`}
                      className="rounded-xl bg-white p-5 shadow-[0_10px_28px_rgba(15,13,43,0.06)]"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${priorityStyle[task.priority]}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        <button className="text-[#0D062D]">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                      <h3 className="text-base font-bold text-[#0D062D]">{task.title}</h3>
                      {task.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#787486]">{task.description}</p>
                      )}
                      <div className="mt-5 flex items-center justify-between gap-3 text-[11px] text-[#787486]">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F9A86E] text-[10px] font-semibold text-white">
                          {getInitials(task.assignedUser.name)}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            0 comments
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            0 files
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#DBDBDB] bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0D062D]">
            <Users className="h-4 w-4 text-[#5030E5]" />
            Members
          </div>
          <p className="mt-2 text-sm text-[#787486]">{members.length} membre(s) dans ce projet.</p>
        </div>
        <div className="rounded-2xl border border-[#DBDBDB] bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0D062D]">
            <FileText className="h-4 w-4 text-[#5030E5]" />
            Documents
          </div>
          <p className="mt-2 text-sm text-[#787486]">Interface prete, API documents encore absente.</p>
        </div>
        <div className="rounded-2xl border border-[#DBDBDB] bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0D062D]">
            <MessageSquare className="h-4 w-4 text-[#5030E5]" />
            Comments
          </div>
          <p className="mt-2 text-sm text-[#787486]">Les commentaires seront branches quand l'API sera disponible.</p>
        </div>
      </section>
    </div>
  )
}

export default ProjectPresentationDetailView
