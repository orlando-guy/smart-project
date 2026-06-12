import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getNotificationsUseCase, 
  markNotificationAsReadUseCase, 
  markAllNotificationsAsReadUseCase 
} from "../../di/notification.container";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotificationsUseCase.execute(),
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsReadUseCase.execute(id),
    onSuccess: () => {
      /**
       * On force le rafraîchissement des données pour que l'état 'lu' 
       * soit immédiatement visible sur tous les composants.
       */
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsReadUseCase.execute(),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    },
  });
}
