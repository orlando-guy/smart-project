import { api } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"

export function useSendMessage() {
    return useMutation({
        mutationFn: async (content: string) => {
            const { data } = await api.post("/messages", { content })
            return data
        },
    })
}
