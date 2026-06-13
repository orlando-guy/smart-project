import { api } from "@/lib/api";
import { Notification } from "../../domain/entities/Notification";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";

export class NotificationRepository implements INotificationRepository {
  async getNotifications(): Promise<Notification[]> {
    const result = await api.get("/notifications");
    const data = result.data?.data ?? result.data;
    return data.map((json: any) => Notification.fromJson(json));
  }

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  }
}
