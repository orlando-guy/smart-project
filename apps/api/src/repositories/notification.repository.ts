import { getPrisma } from "@repo/database";
import { NotificationInput } from "@repo/shared";

export class NotificationRepository {
  readonly #prisma = getPrisma();

  async create(data: NotificationInput) {
    return this.#prisma.notification.create({
      data: {
        type: data.type,
        message: data.message,
        targetedUserId: data.targetedUserId,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.#prisma.notification.findMany({
      where: { targetedUserId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string) {
    return this.#prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.#prisma.notification.updateMany({
      where: { targetedUserId: userId, isRead: false },
      data: { isRead: true },
    });
  }
}
