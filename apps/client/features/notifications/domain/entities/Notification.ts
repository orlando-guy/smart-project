import { NotificationType } from "@repo/shared";

export class Notification {
  constructor(
    public readonly id: string,
    public readonly type: keyof typeof NotificationType,
    public readonly message: string,
    public readonly isRead: boolean,
    public readonly createdAt: Date,
    public readonly targetedUserId: string
  ) {}

  static fromJson(json: any): Notification {
    return new Notification(
      json.id,
      json.type,
      json.message,
      json.isRead,
      new Date(json.createdAt),
      json.targetedUserId
    );
  }
}
