import { ChangeTaskStatusSchema, TaskSchema, UpdateTaskSchema } from "@repo/shared";
import { Router } from "express";
import { TaskController } from "src/controllers/task.controller";
import { requireAuth } from "src/middlewares/auth.middleware";
import { processRequest } from "zod-express-middleware";

const taskRoutes: Router = Router();
const taskController = new TaskController();

/**
 * @openapi
 * /task/create:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, projectId, assignedUserId, priority]
 *             properties:
 *               title: { type: string, example: "Finish API docs" }
 *               description: { type: string, example: "Write down swagger docs for tasks" }
 *               endDate: { type: string, format: date-time, example: "2026-06-10T00:00:00Z" }
 *               priority: { type: string, enum: [MUST, SHOULD, COULD, WONT] }
 *               statut: { type: string, enum: [ACHIEVED, ONGOING, NOT_STARTED] }
 *               projectId: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *               assignedUserId: { type: string, example: "user-123" }
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 */
taskRoutes.post(
    '/task/create',
    [
        requireAuth,
        processRequest({ body: TaskSchema }),
    ],
    taskController.create
);

/**
 * @openapi
 * /task/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *     responses:
 *       200:
 *         description: Task deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Tâche supprimée avec succès" }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       403:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 */
taskRoutes.delete(
    '/task/:id',
    requireAuth,
    taskController.delete
);

/**
 * @openapi
 * /task/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Updated Task Title" }
 *               description: { type: string, example: "Updated Description" }
 *               endDate: { type: string, format: date-time, example: "2026-06-15T00:00:00Z" }
 *               priority: { type: string, enum: [MUST, SHOULD, COULD, WONT] }
 *               statut: { type: string, enum: [ACHIEVED, ONGOING, NOT_STARTED] }
 *               assignedUserId: { type: string, example: "user-456" }
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       403:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 */
taskRoutes.put(
    '/task/:id',
    [
        requireAuth,
        processRequest({ body: UpdateTaskSchema }),
    ],
    taskController.update
);

/**
 * @openapi
 * /task/{id}/status:
 *   patch:
 *     summary: Change task status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [statut]
 *             properties:
 *               statut: { type: string, enum: [ACHIEVED, ONGOING, NOT_STARTED], example: "ONGOING" }
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       403:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 */
taskRoutes.patch(
    '/task/:id/status',
    [
        requireAuth,
        processRequest({ body: ChangeTaskStatusSchema }),
    ],
    taskController.updateStatus
);

export default taskRoutes;
