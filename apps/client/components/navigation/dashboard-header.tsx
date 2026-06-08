'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import {
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Folder,
  LogOut,
  Search,
  UserRound,
} from 'lucide-react'

import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSearchProjects } from '@/features/dashboard-project/application/hooks/useSearchProjects'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/api'
import { clearAuthSession } from '@/lib/auth-util'
import { obtainInitials } from '@/lib/utils'
import { CalendarTasksDrawer } from './calendar-tasks-drawer'
import { HelpDialog } from './help-dialog'
import { NotificationsDropdown } from './notifications-dropdown'

const DashboardHeader = () => {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((state) => state.user)
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
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const activeProjectId = pathname.match(/^\/dashboard\/project\/([^/]+)/)?.[1]

  useEffect(() => {
    if (isActive) {
      setShowDropdown(true)
      setIsClosing(false)
    }
  }, [isActive])

  const closeDropdown = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setShowDropdown(false)
      setIsClosing(false)
      clearSearch()
    }, 200)
  }, [clearSearch])

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

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await api.post('/auth/logout')
    } catch {
      // JWT logout is finalized on the client even if the stateless backend endpoint is unavailable.
    } finally {
      queryClient.clear()
      clearAuthSession()
      setIsLoggingOut(false)
      router.replace('/login')
    }
  }

  return (
    <header className="relative flex h-20 shrink-0 items-center border-b border-[#DBDBDB] bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      <div className="flex w-full items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <SidebarTrigger className="-ml-1 text-[#787486]" />
          <Separator
            orientation="vertical"
            className="mr-1 data-[orientation=vertical]:h-4"
          />

          <div className="relative flex max-w-[460px] flex-1 items-center">
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
              className="h-12 w-full rounded-md border-0 bg-[#F5F5F5] pl-12 pr-4 text-sm text-[#0D062D] outline-none placeholder:text-[#787486] focus:ring-2 focus:ring-[#5030E5]/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-[#787486] hover:text-[#0D062D]"
              aria-label="Calendar"
              onClick={() => setIsCalendarOpen(true)}
            >
              <CalendarDays className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-[#787486] hover:text-[#0D062D]"
              aria-label="Help"
              onClick={() => setIsHelpOpen(true)}
            >
              <CircleHelp className="h-5 w-5" />
            </Button>

            <NotificationsDropdown />
          </div>

          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[#F5F5F5]">
                  <div className="hidden min-w-0 text-right md:block">
                    <p className="truncate text-base font-medium text-[#0D062D]">{currentUser.name}</p>
                    <p className="truncate text-sm text-[#787486]">{currentUser.email}</p>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/default.png" alt={currentUser.name} />
                    <AvatarFallback className="bg-[#5030E5] text-white">
                      {obtainInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-[#787486]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0D062D]">{currentUser.name}</p>
                    <p className="truncate text-xs text-[#787486]">{currentUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard')}>
                  <UserRound className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 top-20 z-40"
            onClick={closeDropdown}
            aria-hidden="true"
          />

          <div
            ref={dropdownRef}
            className={`absolute left-0 right-0 top-full z-50 mx-4 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-background md:mx-8 ${
              isClosing ? 'search-dropdown-exit' : 'search-dropdown-enter'
            }`}
            style={{ boxShadow: 'var(--shadow-soft-lg)' }}
          >
            {isLoading ? (
              <div className="space-y-3 p-4">
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
              <div className="flex flex-col items-center justify-center px-4 py-10">
                <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                  No projects found
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
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
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {project.titre}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
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

      <CalendarTasksDrawer
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        projectId={activeProjectId}
      />
      <HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </header>
  )
}

export default DashboardHeader
