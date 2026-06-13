/**
 * @openapi
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required: [id, title, description, leadId, createdAt]
 *       properties:
 *         id: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *         title: { type: string, example: "Alpha Project" }
 *         description: { type: string, example: "A project to revolutionize documentation" }
 *         leadId: { type: string, example: "user-123" }
 *         createdAt: { type: string, format: date-time, example: "2026-06-07T12:00:00Z" }
 *     User:
 *       type: object
 *       required: [id, name, email]
 *       properties:
 *         id: { type: string, example: "user-123" }
 *         name: { type: string, example: "John Doe" }
 *         email: { type: string, example: "john@example.com" }
 *     ApiNotification:
 *       type: object
 *       properties:
 *         id: { type: string, example: "notif-789" }
 *         type: { type: string, enum: [TASK_ASSIGNED, PROJECT_INVITATION, PROJECT_CREATED, TASK_STATUS_CHANGED], example: "TASK_ASSIGNED" }
 *         message: { type: string, example: "Vous avez été assigné à une nouvelle tâche." }
 *         isRead: { type: boolean, example: false }
 *         createdAt: { type: string, format: date-time, example: "2026-06-07T12:00:00Z" }
 *         targetedUserId: { type: string, example: "user-123" }
 *     ApiError:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         message: { type: string, example: "An error occurred." }
 *   responses:
 *     StandardError:
 *       description: Operational Error
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ApiError' }
 */
export const schemas = {};
