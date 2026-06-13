import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  getNotifications(): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
}
