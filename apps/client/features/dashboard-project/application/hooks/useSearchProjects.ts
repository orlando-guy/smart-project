"use client"

import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { QueryBuilder } from "../../domain/query/QueryBuilder"
import { getProjectUseCase } from "../../di/project.container"

export function useSearchProjects() {
    const [searchTerm, setSearchTerm] = useState("")
    const [enabled, setEnabled] = useState(false)

    const query = new QueryBuilder()
        .paginate(1, 10)
        .search(searchTerm)

    const { data: results, isLoading, refetch } = useQuery({
        queryKey: ['projects', 'search', searchTerm],
        queryFn: () => getProjectUseCase.execute(query),
        enabled,
    })

    const triggerSearch = useCallback(() => {
        if (searchTerm.trim().length === 0) return
        setEnabled(true)
        refetch()
    }, [searchTerm, refetch])

    const clearSearch = useCallback(() => {
        setSearchTerm("")
        setEnabled(false)
    }, [])

    return {
        searchTerm,
        setSearchTerm,
        results: results ?? [],
        isLoading,
        isActive: enabled && searchTerm.trim().length > 0,
        triggerSearch,
        clearSearch,
    }
}
