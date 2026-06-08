"use client"

import { Bell } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/lib/api"

type NotificationItem = {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

type NotificationsResponse = {
  data: NotificationItem[]
}

function formatNotificationDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(date))
}

export function NotificationsDropdown() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get<NotificationsResponse>("/notifications")
      return response.data.data
    },
    refetchInterval: 30000,
  })

  const unreadCount = data.filter((notification) => !notification.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-[#787486] hover:text-[#0D062D]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D25B68] px-1 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <span className="text-xs font-normal text-[#787486]">
            {unreadCount} non lue(s)
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading && (
          <DropdownMenuItem disabled>Chargement des notifications...</DropdownMenuItem>
        )}

        {error && (
          <DropdownMenuItem disabled>
            Impossible de charger les notifications.
          </DropdownMenuItem>
        )}

        {!isLoading && !error && data.length === 0 && (
          <DropdownMenuItem disabled>Aucune notification.</DropdownMenuItem>
        )}

        {!isLoading && !error && data.map((notification) => (
          <DropdownMenuItem key={notification.id} className="items-start gap-3 py-3">
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                notification.read ? "bg-[#DBDBDB]" : "bg-[#D25B68]"
              }`}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0D062D]">
                {notification.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#787486]">
                {notification.message}
              </p>
              <p className="mt-1 text-[11px] text-[#A6A3B1]">
                {formatNotificationDate(notification.createdAt)}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
