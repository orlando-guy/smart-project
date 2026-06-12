import { Notification } from "../entities/Notification";
import { INotificationRepository } from "../repositories/INotificationRepository";

export class GetNotificationsUseCase {
  constructor(private readonly repository: INotificationRepository) {}

  async execute(): Promise<Notification[]> {
    return this.repository.getNotifications();
  }
}
