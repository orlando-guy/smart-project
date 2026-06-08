import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type UserOption = {
    id: string;
    name: string;
    email: string;
};

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await api.get<{ data: UserOption[] }>("/users/all");
            return data.data;
        },
    });
}
