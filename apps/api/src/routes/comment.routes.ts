import { CreateCommentSchema } from "@repo/shared";
import { Router } from "express";
import { CommentController } from "src/controllers/comment.controller";
import { requireAuth } from "src/middlewares/auth.middleware";
import { processRequest } from "zod-express-middleware";

const commentRoutes: Router = Router();
const commentController = new CommentController();

/**
 * @openapi
 * /tasks/{taskId}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: { type: string, example: "uuid" }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description]
 *             properties:
 *               description: { type: string, example: "Great work!" }
 *     responses:
 *       201:
 *         description: Comment created
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
commentRoutes.post(
    '/tasks/:taskId/comments',
    [
        requireAuth,
        processRequest({ body: CreateCommentSchema }),
    ],
    commentController.create
);

export default commentRoutes;
