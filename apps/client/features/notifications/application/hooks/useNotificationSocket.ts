import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SocketClient } from "../../infrastructure/socket/SocketClient";
import { Notification } from "../../domain/entities/Notification";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export function useNotificationSocket() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) return;

    const socketClient = SocketClient.getInstance();
    const socket = socketClient.connect(user.id);

    if (socket) {
      socket.on("notification", (data: any) => {
        const newNotification = Notification.fromJson(data);

        // Mettre à jour le cache React Query
        queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) => {
          if (!old) return [newNotification];
          return [newNotification, ...old];
        });

        // Afficher un toast
        toast.info("Nouvelle notification", {
          description: newNotification.message,
        });
      });
    }

    return () => {
      // On déconnecte optionnellement ou on garde la connexion
      // Pour la performance, on peut garder la connexion active tant que l'utilisateur est sur le dashboard
    };
  }, [user?.id, queryClient]);
}
