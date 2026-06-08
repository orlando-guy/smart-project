'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useProjects } from "../../application/hooks/useProjects"
import ProjectTable from "../components/project-table"
import { Project } from "../../domain/entities/Project"
import ProjectTableSkeleton from "../components/skeletons/project-table-skeleton"
import { useProjectCreateModalStore } from "@/store/useProjectCreateModalStore"

export default function ProjectPresentationView() {
    const openCreateProjectModal = useProjectCreateModalStore((state) => state.open)
    const {
        data,
        isLoading,
        error
    } = useProjects()

    if (isLoading) {
        return (
            <div className="container px-4 md:px-6">
                <ProjectTableSkeleton />
            </div>
        )
    }

    if (error) {
        return <p>{error.message}</p>
    }

    if (data !== undefined && data.length === 0) {
        return (
            <div className="container flex h-full w-full items-center justify-center">
                <section className="flex flex-col gap-6">
                    <Image
                        src="/remote-management.png"
                        alt="a remote worker managing remote work"
                        width={1500}
                        height={1500}
                        className="w-3xs h-auto"
                    />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Aucun projet</h2>
                        <p className="mt-4 text-base font-normal">
                            Vous n&apos;avez encore cree aucun projet !
                        </p>
                    </div>
                    <Button
                        className="cursor-pointer py-6"
                        onClick={openCreateProjectModal}
                    >
                        Creer votre premier projet
                    </Button>
                </section>
            </div>
        )
    }

    return (
        <div className="container px-4 md:px-6">
            <ProjectTable projects={data as Project[]} />
        </div>
    )
}
