import Image from "next/image"
import { FileTextIcon, MessageCircleIcon, MoreHorizontalIcon } from "lucide-react"
import { ProjectMember, ProjectTask, TaskStatus } from "../../domain/entities/Project"

const columns: {
    status: TaskStatus
    title: string
    dotClass: string
    lineClass: string
}[] = [
    {
        status: "NOT_STARTED",
        title: "To Do",
        dotClass: "bg-[#5030E5]",
        lineClass: "bg-[#5030E5]",
    },
    {
        status: "ONGOING",
        title: "On Progress",
        dotClass: "bg-[#FFA500]",
        lineClass: "bg-[#FFA500]",
    },
    {
        status: "ACHIEVED",
        title: "Done",
        dotClass: "bg-[#76A5EA]",
        lineClass: "bg-[#8BC48A]",
    },
]

const priorityMap = {
    MUST: {
        label: "High",
        className: "bg-[#D8727D]/10 text-[#D8727D]",
    },
    SHOULD: {
        label: "Low",
        className: "bg-[#DFA874]/20 text-[#D58D49]",
    },
    COULD: {
        label: "Low",
        className: "bg-[#DFA874]/20 text-[#D58D49]",
    },
    WONT: {
        label: "Low",
        className: "bg-[#DFA874]/20 text-[#D58D49]",
    },
}

const avatarColors = [
    "bg-[#F4B55A] text-[#7A4A00]",
    "bg-[#E4CCFD] text-[#5030E5]",
    "bg-[#76A5EA] text-white",
    "bg-[#8BC48A] text-white",
]

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
}

function getMetaCount(seed: string, base: number) {
    return (seed.length % 8) + base
}

function getTaskBadge(task: ProjectTask) {
    if (task.statut === "ACHIEVED") {
        return {
            label: "Completed",
            className: "bg-[#83C29D]/20 text-[#68B266]",
        }
    }

    return priorityMap[task.priority]
}

function shouldShowPreview(task: ProjectTask, index: number) {
    return task.statut !== "NOT_STARTED" && index % 2 === 0
}

type ProjectTaskBoardProps = {
    tasks: ProjectTask[]
    members?: ProjectMember[]
}

export function ProjectTaskBoard({ tasks, members = [] }: Readonly<ProjectTaskBoardProps>) {
    return (
        <div className="grid gap-4 xl:grid-cols-3">
            {columns.map((column) => {
                const columnTasks = tasks.filter((task) => task.statut === column.status)

                return (
                    <section key={column.status} className="rounded-2xl bg-[#F5F5F5] px-4 py-5">
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${column.dotClass}`} />
                                <h2 className="text-sm font-semibold text-[#0D062D]">{column.title}</h2>
                                <span className="ml-1 rounded-full bg-[#E0E0E0] px-2 py-0.5 text-xs font-medium text-[#625F6D]">
                                    {columnTasks.length}
                                </span>
                            </div>
                            <div className={`mt-4 h-[3px] rounded-full ${column.lineClass}`} />
                        </div>

                        <div className="space-y-4">
                            {columnTasks.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[#DADAE4] bg-white p-5 text-sm text-[#787486]">
                                    Aucune tache dans cette colonne.
                                </div>
                            ) : (
                                columnTasks.map((task, taskIndex) => {
                                    const badge = getTaskBadge(task)
                                    const assignees = members.length > 0 ? members.slice(0, 3) : []
                                    const commentCount = getMetaCount(task.title, 6)
                                    const fileCount = getMetaCount(task.title + task.statut, 2)
                                    const showPreview = shouldShowPreview(task, taskIndex)

                                    return (
                                        <article
                                            key={`${task.title}-${task.assignedUser.id}-${taskIndex}`}
                                            className="rounded-2xl bg-white p-4 shadow-[0_6px_18px_rgba(13,6,45,0.04)]"
                                        >
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <span className={`rounded px-2 py-1 text-xs font-medium ${badge.className}`}>
                                                    {badge.label}
                                                </span>
                                                <MoreHorizontalIcon className="h-5 w-5 text-[#0D062D]" />
                                            </div>

                                            <h3 className="text-base font-semibold text-[#0D062D]">{task.title}</h3>
                                            {task.description && (
                                                <p className="mt-2 text-xs leading-5 text-[#787486]">{task.description}</p>
                                            )}

                                            {showPreview && (
                                                <div className="mt-4 overflow-hidden rounded-lg bg-[#EEF2FF]">
                                                    <Image
                                                        src="/remote-management.png"
                                                        alt=""
                                                        width={420}
                                                        height={180}
                                                        className="h-28 w-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex -space-x-2">
                                                    {(assignees.length > 0 ? assignees : [{ user: task.assignedUser }]).map((member, index) => (
                                                        <span
                                                            key={`${member.user.id}-${index}`}
                                                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${avatarColors[index % avatarColors.length]}`}
                                                            title={member.user.name}
                                                        >
                                                            {getInitials(member.user.name)}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-3 text-xs font-medium text-[#787486]">
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircleIcon className="h-4 w-4" />
                                                        {commentCount} comments
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FileTextIcon className="h-4 w-4" />
                                                        {fileCount} files
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })
                            )}
                        </div>
                    </section>
                )
            })}
        </div>
    )
}
