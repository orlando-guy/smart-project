"use client"

import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { QueryBuilder } from "../../domain/query/QueryBuilder"
import { getProjectUseCase } from "../../di/project.container"

export function useSearchProjects() {
    const [searchTerm, setSearchTerm] = useState("")
    const [submittedTerm, setSubmittedTerm] = useState("")

    const query = new QueryBuilder()
        .paginate(1, 10)
        .search(submittedTerm)

    const { data: results, isLoading } = useQuery({
        queryKey: ['projects', 'search', submittedTerm],
        queryFn: () => getProjectUseCase.execute(query),
        enabled: submittedTerm.trim().length > 0,
    })

    const triggerSearch = useCallback(() => {
        const term = searchTerm.trim()
        if (term.length === 0) return
        setSubmittedTerm(term)
    }, [searchTerm])

    const clearSearch = useCallback(() => {
        setSearchTerm("")
        setSubmittedTerm("")
    }, [])

    return {
        searchTerm,
        setSearchTerm,
        results: results ?? [],
        isLoading,
        isActive: submittedTerm.trim().length > 0,
        triggerSearch,
        clearSearch,
    }
}
