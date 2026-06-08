import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export type NotificationItem = {
    id: string
    title: string
    message: string
    read: boolean
    createdAt: string
}

export function useNotifications() {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await api.get<{ data: NotificationItem[] }>("/notifications")
            return data.data
        },
    })
}
