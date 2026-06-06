"use client"

import { useQuery } from "@tanstack/react-query"
import { getSingleProjectUseCase } from "../../di/project.container"

export function useSingleProject(projectId: string) {
    
    const {data: results, isLoading, error} = useQuery({
        queryKey: ['single_project', projectId],
        queryFn: () => getSingleProjectUseCase.execute(projectId),
        enabled: Boolean(projectId)
    })

    return {
        results,
        isLoading,
        error
    }
}