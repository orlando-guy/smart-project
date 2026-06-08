"use client"

import { useQuery } from "@tanstack/react-query"
import { QueryBuilder } from "../../domain/query/QueryBuilder"
import { getProjectUseCase } from "../../di/project.container"

export function useProjects() {
    const query = new QueryBuilder()
        .paginate(1, 10)
    
        return useQuery({
            queryKey: ['projects', query.build()],
            queryFn: () => getProjectUseCase.execute(query)
        })
}
