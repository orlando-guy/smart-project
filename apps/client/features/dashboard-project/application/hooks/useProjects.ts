"use client"

import { useQuery } from "@tanstack/react-query"
import { QueryBuilder } from "../../domain/query/QueryBuilder"
import { getProjectUseCase } from "../../di/project.container"

export function useProjects(search?: string) {
    const query = new QueryBuilder().paginate(1, 10)
    if (search) {
        query.search(search)
    }

    return useQuery({
        queryKey: ['projects', query.build()],
        queryFn: () => getProjectUseCase.execute(query)
    })
}