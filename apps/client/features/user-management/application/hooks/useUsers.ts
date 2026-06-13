import { useQuery } from "@tanstack/react-query";
import { getAllUsersUseCase } from "../../di/user.container";


export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsersUseCase.execute()
  });
}
