import { NotificationInput, NotificationType } from "@repo/shared";
import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
  constructor(
    private readonly notificationRepository = new NotificationRepository()
  ) {}

  async notify(data: NotificationInput) {
    const notification = await this.notificationRepository.create(data);
    
    // TODO: Déclencher l'envoi via WebSockets ici dans le futur
    // console.log(`[Notification Service] Envoi en temps réel à l'utilisateur ${data.targetedUserId}`);
    
    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepository.findByUserId(userId);
  }

  async markAsRead(notificationId: string) {
    return this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
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
