import { NotificationInput, NotificationType } from "@repo/shared";
import { NotificationRepository } from "../repositories/notification.repository";
import { SocketService } from "./socket.service";

export class NotificationService {
  constructor(
    private readonly notificationRepository = new NotificationRepository(),
    private readonly socketService = SocketService.getInstance()
  ) {}

  async notify(data: NotificationInput) {
    const notification = await this.notificationRepository.create(data);
    
    // Envoi en temps réel via WebSockets
    this.socketService.emitToUser(data.targetedUserId, 'notification', notification);
    
    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepository.findByUserId(userId);
  }

  async markAsRead(notificationId: string) {
    /**
     * Marque une notification spécifique comme lue.
     * Cette action est irréversible via cet endpoint.
     */
    return this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    /**
     * Marque toutes les notifications non lues d'un utilisateur comme lues.
     * Optimisé via un updateMany dans le repository.
     */
    return this.notificationRepository.markAllAsRead(userId);
  }

  // Méthodes utilitaires pour simplifier l'appel depuis les autres services
  async notifyTaskAssigned(userId: string, taskTitle: string) {
    return this.notify({
      type: NotificationType.TASK_ASSIGNED,
      message: `Vous avez été assigné à la tâche : "${taskTitle}"`,
      targetedUserId: userId
    });
  }

  async notifyProjectCreated(userId: string, projectTitle: string) {
    return this.notify({
      type: NotificationType.PROJECT_CREATED,
      message: `Votre projet "${projectTitle}" a été créé avec succès`,
      targetedUserId: userId
    });
  }

  async notifyProjectInvitation(userId: string, projectTitle: string) {
    return this.notify({
      type: NotificationType.PROJECT_INVITATION,
      message: `Vous avez été ajouté au projet : "${projectTitle}"`,
      targetedUserId: userId
    });
  }
}
