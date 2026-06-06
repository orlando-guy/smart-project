'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { Search, CalendarDays, CircleHelp, Bell, Folder } from 'lucide-react'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { useSearchProjects } from '@/features/dashboard-project/application/hooks/useSearchProjects'
import { useRouter } from 'next/navigation'

const DashboardHeader = () => {
  const router = useRouter()
  const {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    isActive,
    triggerSearch,
    clearSearch,
  } = useSearchProjects()

  const [showDropdown, setShowDropdown] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Show dropdown when search becomes active
  useEffect(() => {
    if (isActive) {
      setShowDropdown(true)
      setIsClosing(false)
    }
  }, [isActive])

  // Close dropdown with exit animation
  const closeDropdown = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }
    setIsClosing(true)
    closeTimerRef.current = setTimeout(() => {
      setShowDropdown(false)
      setIsClosing(false)
      clearSearch()
    }, 200) // matches animation duration
  }, [clearSearch])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        closeDropdown()
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown, closeDropdown])

  const handleSearch = () => {
    triggerSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
    if (e.key === 'Escape' && showDropdown) {
      closeDropdown()
    }
  }

  const handleResultClick = (projectId: string) => {
    closeDropdown()
    router.push(`/dashboard/project/${projectId}`)
  }

  return (
    <header className="relative flex h-16 shrink-0 items-center border-b border-border bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between px-4 md:px-6">
        {/* Left section: Sidebar trigger + Search */}
        <div className="flex items-center gap-3 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-1 data-[orientation=vertical]:h-4"
          />

          {/* Search bar */}
          <div className="relative flex items-center max-w-md flex-1">
            <button
              type="button"
              onClick={handleSearch}
              className="absolute left-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Search projects"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for anything..."
              className="h-10 w-full rounded-lg border border-border bg-transparent pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
        </div>

        {/* Right section: Action icons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Calendar"
          >
            <CalendarDays className="h-4.5 w-4.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Help"
          >
            <CircleHelp className="h-4.5 w-4.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {/* Notification indicator dot */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-(--text-danger) ring-2 ring-background" />
          </Button>
        </div>
      </div>

      {/* Search results dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 top-16 z-40"
            onClick={closeDropdown}
            aria-hidden="true"
          />

          {/* Results panel */}
          <div
            ref={dropdownRef}
            className={`absolute top-full left-0 right-0 z-50 mx-4 md:mx-6 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-background ${isClosing ? 'search-dropdown-exit' : 'search-dropdown-enter'
              }`}
            style={{ boxShadow: 'var(--shadow-soft-lg)' }}
          >
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-3/5" />
                      <Skeleton className="h-3 w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4">
                <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No projects found
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <ul className="py-2" role="listbox" aria-label="Search results">
                {results.map((project) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => handleResultClick(project.id)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent cursor-pointer"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {project.titre}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {project.lead?.name ?? 'No lead'} · {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </header>
  )
}

export default DashboardHeader