'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AddProjectModal } from "../components/modals/add-project-modal"
import React, { useState } from "react"
import { useProjects } from "../../application/hooks/useProjects"
import ProjectTable from "../components/project-table"
import { Project } from "../../domain/entities/Project"
import { Loader } from "@/components/shared/loader"
import { ErrorDisplay } from "@/components/shared/error-display"

export default function ProjectPresentationView() {
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)
    const {
        data,
        isLoading,
        error
    } = useProjects()

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-100">
                <Loader size="lg" label="Chargement du projet..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-100 px-4">
                <ErrorDisplay 
                    message={error.message} 
                    onRetry={() => globalThis.window.location.reload()} 
                />
            </div>
        )
    }

    if (data !== undefined && data.length === 0) {
        return (
            <div className="container w-full h-full flex items-center justify-center">
                <section className="flex flex-col gap-6">
                    <Image
                        src="/remote-management.png"
                        alt="a remote worker managing is remote work"
                        width={1500}
                        height={1500}
                        className="w-3xs h-auto"
                    />
                    <div className="text-center">
                        <h2 className="font-bold text-2xl">Aucun projet</h2>
                        <p className="text-base font-normal mt-4">Vous n&apos;avez encore créer aucun projet !</p>
                    </div>
                    <Button
                        className="cursor-pointer py-6"
                        onClick={() => setIsAddProjectModalOpen(true)}
                    >
                        Créer votre premier projet
                    </Button>
                </section>
                <AddProjectModal
                    open={isAddProjectModalOpen}
                    onOpenChange={setIsAddProjectModalOpen}
                />
            </div>
        )
    }

    return (
        <div className="container px-4 md:px-6">
            <ProjectTable
                projects={data as Project[]}
            />

            <AddProjectModal
                open={isAddProjectModalOpen}
                onOpenChange={setIsAddProjectModalOpen}
            />
        </div>
    )
}
