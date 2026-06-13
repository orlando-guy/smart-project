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
    <header className="relative flex h-[68px] shrink-0 items-center border-b border-[#DBDBDB] bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between px-5 md:px-9">
        {/* Left section: Sidebar trigger + Search */}
        <div className="flex items-center gap-3 flex-1">
          <SidebarTrigger className="-ml-2 text-[#787486] hover:bg-[#F5F5F7] hover:text-[#0D062D]" />
          <Separator
            orientation="vertical"
            className="mr-3 bg-transparent data-[orientation=vertical]:h-4"
          />

          {/* Search bar */}
          <div className="relative flex max-w-[420px] flex-1 items-center">
            <button
              type="button"
              onClick={handleSearch}
              className="absolute left-4 flex items-center justify-center text-[#787486] transition-colors hover:text-[#0D062D]"
              aria-label="Search projects"
            >
              <Search className="h-5 w-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for anything..."
              className="h-11 w-full rounded-md border border-transparent bg-[#F5F5F5] pl-12 pr-4 text-sm text-[#0D062D] outline-none transition-colors placeholder:text-[#787486] focus:border-[#5030E5]/25 focus:ring-2 focus:ring-[#5030E5]/10"
            />
          </div>
        </div>

        {/* Right section: Action icons */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-[#787486] hover:bg-[#F5F5F7] hover:text-[#0D062D]"
            aria-label="Calendar"
          >
            <CalendarDays className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-[#787486] hover:bg-[#F5F5F7] hover:text-[#0D062D]"
            aria-label="Help"
          >
            <CircleHelp className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-[#787486] hover:bg-[#F5F5F7] hover:text-[#0D062D]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification indicator dot */}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D25B68] ring-2 ring-white" />
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
            className={`absolute left-5 right-5 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-[#DBDBDB] bg-white md:left-9 md:right-auto md:w-[420px] ${isClosing ? 'search-dropdown-exit' : 'search-dropdown-enter'
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
