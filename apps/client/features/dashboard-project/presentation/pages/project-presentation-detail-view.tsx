"use client"

import React, { useState } from "react"
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  FilterIcon,
  GripIcon,
  Link2Icon,
  ListIcon,
  PencilIcon,
  PlusIcon,
  Share2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSingleProject } from "../../application/hooks/useSingleProject"
import { ProjectMember, ProjectTask } from "../../domain/entities/Project"
import { InviteMemberModal } from "../components/modals/invite-member-modal"
import { ProjectTaskBoard } from "../components/project-task-board"

interface ProjectPresentationDetailViewProps {
  projectId: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function buildPreviewMembers(projectTitle: string): ProjectMember[] {
  return [
    {
      user: {
        id: "preview-member-1",
        name: "Alex Morgan",
        email: "alex@smart-project.local",
      },
    },
    {
      user: {
        id: "preview-member-2",
        name: "Maya Chen",
        email: "maya@smart-project.local",
      },
    },
    {
      user: {
        id: "preview-member-3",
        name: projectTitle,
        email: "project@smart-project.local",
      },
    },
    {
      user: {
        id: "preview-member-4",
        name: "Sam Lee",
        email: "sam@smart-project.local",
      },
    },
  ]
}

const previewTasks: ProjectTask[] = [
  {
    title: "Brainstorming",
    description: "Brainstorming brings team members' diverse experience into play.",
    endDate: "2026-06-12",
    priority: "SHOULD",
    statut: "NOT_STARTED",
    assignedUser: {
      id: "preview-member-1",
      name: "Alex Morgan",
    },
  },
  {
    title: "Research",
    description: "User research helps you to create an optimal product for users.",
    endDate: "2026-06-13",
    priority: "MUST",
    statut: "NOT_STARTED",
    assignedUser: {
      id: "preview-member-2",
      name: "Maya Chen",
    },
  },
  {
    title: "Wireframes",
    description: "Low fidelity wireframes include the most basic content and visuals.",
    endDate: "2026-06-15",
    priority: "MUST",
    statut: "NOT_STARTED",
    assignedUser: {
      id: "preview-member-3",
      name: "Sam Lee",
    },
  },
  {
    title: "Onboarding Illustrations",
    description: "Create friendly visuals for the first user journey.",
    endDate: "2026-06-16",
    priority: "SHOULD",
    statut: "ONGOING",
    assignedUser: {
      id: "preview-member-1",
      name: "Alex Morgan",
    },
  },
  {
    title: "Moodboard",
    description: "Collect UI references and align the visual direction.",
    endDate: "2026-06-18",
    priority: "SHOULD",
    statut: "ONGOING",
    assignedUser: {
      id: "preview-member-2",
      name: "Maya Chen",
    },
  },
  {
    title: "Mobile App Design",
    description: "Complete the main screens and prepare them for review.",
    endDate: "2026-06-20",
    priority: "COULD",
    statut: "ACHIEVED",
    assignedUser: {
      id: "preview-member-3",
      name: "Sam Lee",
    },
  },
  {
    title: "Design System",
    description: "It just needs to adapt the UI from what you did before.",
    endDate: "2026-06-21",
    priority: "COULD",
    statut: "ACHIEVED",
    assignedUser: {
      id: "preview-member-4",
      name: "Nina Smith",
    },
  },
]

const avatarColors = [
  "bg-[#F4B55A] text-[#7A4A00]",
  "bg-[#8BC48A] text-white",
  "bg-[#76A5EA] text-white",
  "bg-[#D8727D] text-white",
]

function AvatarStack({ members }: Readonly<{ members: ProjectMember[] }>) {
  const visibleMembers = members.slice(0, 4)
  const overflow = Math.max(members.length - visibleMembers.length, 0)

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visibleMembers.map((member, index) => (
          <span
            key={member.user.id}
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${avatarColors[index % avatarColors.length]}`}
            title={member.user.name}
          >
            {getInitials(member.user.name)}
          </span>
        ))}
      </div>
      {overflow > 0 && (
        <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#F4D7DA] text-xs font-medium text-[#D25B68]">
          +{overflow}
        </span>
      )}
    </div>
  )
}

const ProjectPresentationDetailView = ({
  projectId,
}: Readonly<ProjectPresentationDetailViewProps>) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const { results, isLoading, error } = useSingleProject(projectId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-6 py-10">
        <p className="text-sm text-[#787486]">Chargement du projet...</p>
      </div>
    )
  }

  if (error) {
    console.error(error.message)
    return (
      <div className="min-h-screen bg-white px-6 py-10">
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-white px-6 py-10">
        <p className="text-sm text-[#787486]">Projet introuvable.</p>
      </div>
    )
  }

  const apiMembers = results.teams ?? []
  const apiTasks = results.tasks ?? []
  const isPreviewMode = apiMembers.length === 0 && apiTasks.length === 0
  const members = apiMembers.length > 0 ? apiMembers : buildPreviewMembers(results.titre)
  const tasks = apiTasks.length > 0 ? apiTasks : previewTasks

  return (
    <div className="min-h-screen bg-white px-5 py-8 md:px-8">
      <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-semibold tracking-normal text-[#0D062D] md:text-[46px] md:leading-[1.05]">
              {results.titre}
            </h1>
            <div className="flex items-center gap-3">
              <button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#5030E5]/10 text-[#5030E5]">
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Edit project</span>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#5030E5]/10 text-[#5030E5]">
                <Link2Icon className="h-4 w-4" />
                <span className="sr-only">Copy project link</span>
              </button>
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-[#787486]">{results.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <Button
            variant="link"
            className="h-9 cursor-pointer px-0 text-[#5030E5]"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-[#5030E5]/10">
                <PlusIcon className="h-3 w-3" />
              </span>
              Invite
            </span>
          </Button>

          <AvatarStack members={members} />
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-10 gap-2 rounded-md border-[#787486] bg-white px-4 text-[#787486]">
            <FilterIcon className="h-4 w-4" />
            Filter
            <ChevronDownIcon className="h-4 w-4" />
          </Button>

          <Button variant="outline" className="h-10 gap-2 rounded-md border-[#787486] bg-white px-4 text-[#787486]">
            <CalendarDaysIcon className="h-4 w-4" />
            Today
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-10 gap-2 rounded-md border-[#787486] bg-white px-4 text-[#787486]">
            <Share2Icon className="h-4 w-4" />
            Share
          </Button>
          <div className="h-7 w-px bg-[#787486]/40" />
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-md bg-[#5030E5] text-white">
              <ListIcon className="h-5 w-5" />
              <span className="sr-only">List view</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-md text-[#787486] hover:bg-[#F5F5F5]">
              <GripIcon className="h-5 w-5" />
              <span className="sr-only">Grid view</span>
            </button>
          </div>
        </div>
      </div>

      {isPreviewMode && (
        <div className="mb-6 rounded-xl border border-[#5030E5]/15 bg-[#5030E5]/5 px-4 py-3 text-sm text-[#5030E5]">
          Apercu frontend: l'API ne renvoie pas encore de membres ni de taches pour ce projet.
        </div>
      )}

      <ProjectTaskBoard tasks={tasks} members={members} />

      <InviteMemberModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        projectId={projectId}
        members={apiMembers}
      />
    </div>
  )
}

export default ProjectPresentationDetailView
