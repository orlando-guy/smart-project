import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SocketClient } from "../../infrastructure/socket/SocketClient";
import { Notification } from "../../domain/entities/Notification";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Hook personnalisé pour gérer la synchronisation en temps réel des notifications.
 * 
 * @description
 * Ce hook établit une connexion WebSocket sécurisée via Socket.io.
 * Il écoute l'événement 'notification' et met à jour automatiquement
 * le cache de React Query sans nécessiter de rafraîchissement HTTP.
 * 
 * @example
 * // Utilisation dans un Layout ou un composant de haut niveau
 * useNotificationSocket();
 */
export function useNotificationSocket() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, on ne tente pas de connexion socket
    if (!token) return;

    const socketClient = SocketClient.getInstance();
    const socket = socketClient.connect();

    if (socket) {
      // Écoute de l'événement de notification envoyé par l'API
      socket.on("notification", (data: any) => {
        const newNotification = Notification.fromJson(data);

        /**
         * Mise à jour optimiste du cache React Query.
         * On ajoute la nouvelle notification en haut de la liste existante.
         */
        queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) => {
          if (!old) return [newNotification];
          return [newNotification, ...old];
        });

        // Affichage d'une alerte visuelle éphémère (Toast)
        toast.info("Nouvelle notification", {
          description: newNotification.message,
        });
      });
    }

    return () => {
      /**
       * Nettoyage : On retire l'écouteur pour éviter les fuites de mémoire
       * ou les mises à jour multiples lors des re-renders.
       */
      socket?.off("notification");
    };
  }, [token, queryClient]);
}
