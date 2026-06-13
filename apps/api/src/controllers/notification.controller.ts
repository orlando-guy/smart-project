import { Request, Response } from "express";
import { NotificationService } from "src/services/notification.service";

export class NotificationController {
  constructor(
    private readonly notificationService = new NotificationService()
  ) {}

  getUserNotifications = async (req: Request, res: Response) => {
    // req.user.id est disponible via le middleware requireAuth
    const notifications = await this.notificationService.getUserNotifications(req.user.id);

    return res.status(200).json({
      success: true,
      data: notifications
    });
  }

  markAsRead = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.notificationService.markAsRead(id as string);

    return res.status(200).json({
      success: true,
      message: "Notification marquée comme lue"
    });
  }

  markAllAsRead = async (req: Request, res: Response) => {
    await this.notificationService.markAllAsRead(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Toutes les notifications ont été marquées comme lues"
    });
  }
}
