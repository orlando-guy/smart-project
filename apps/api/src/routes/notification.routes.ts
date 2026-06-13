import { Router } from "express";
import { NotificationController } from "src/controllers/notification.controller";
import { requireAuth } from "src/middlewares/auth.middleware";

const notificationRoutes: Router = Router();
const notificationController = new NotificationController();

/**
 * @openapi
 * /notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ApiNotification' }
 */
notificationRoutes.get(
  '/',
  requireAuth,
  notificationController.getUserNotifications
);

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
notificationRoutes.patch(
  '/:id/read',
  requireAuth,
  notificationController.markAsRead
);

/**
 * @openapi
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
notificationRoutes.patch(
  '/read-all',
  requireAuth,
  notificationController.markAllAsRead
);

export default notificationRoutes;
