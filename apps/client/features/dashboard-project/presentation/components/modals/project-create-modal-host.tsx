"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useProjectCreateModalStore } from "@/store/useProjectCreateModalStore"
import { useCreateProject } from "@/features/dashboard-project/application/mutations/useCreateProject"
import {
    ProjectDisplayStatus,
    ProjectFormModal,
} from "@/features/dashboard-project/presentation/components/modals/project-form-modal"
import { Project } from "@/features/dashboard-project/domain/entities/Project"

export function ProjectCreateModalHost() {
    const router = useRouter()
    const { isOpen, setOpen, close } = useProjectCreateModalStore()
    const createProjectMutation = useCreateProject()

    function handleCreateProject(values: {
        title: string
        description: string
        color: string
        status: ProjectDisplayStatus
    }) {
        createProjectMutation.mutate(
            {
                title: values.title,
                description: values.description,
            },
            {
                onSuccess: (project) => {
                    const createdProject = project as Project
                    toast.success("Projet créé avec succès.")
                    close()
                    router.push(`/dashboard/project/${createdProject.id}`)
                },
                onError: () => {
                    toast.error("Impossible de créer le projet.")
                },
            }
        )
    }

    return (
        <ProjectFormModal
            mode="create"
            open={isOpen}
            onOpenChange={setOpen}
            isPending={createProjectMutation.isPending}
            onSubmit={handleCreateProject}
        />
    )
}
