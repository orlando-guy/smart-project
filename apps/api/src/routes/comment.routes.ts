import { Router } from "express";
import { CommentController } from "src/controllers/comment.controller";
import { requireAuth } from "src/middlewares/auth.middleware";
import { processRequest } from "zod-express-middleware";
import { CreateCommentSchema, PaginationSchema } from "@repo/shared";

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
const validatePagination = (req: Request, res: Response, next: NextFunction) => {
    const result = PaginationSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ success: false, message: "Invalid pagination parameters", errors: result.error });
    }
    // On attache les données validées à une propriété personnalisée pour éviter de modifier req.query
    (req as any).validatedQuery = result.data;
    next();
};

commentRoutes.post(
    '/tasks/:taskId/comments',
    [
        requireAuth,
        processRequest({ body: CreateCommentSchema }),
    ],
    commentController.create
);

commentRoutes.get(
    '/tasks/:taskId/comments',
    [
        requireAuth,
        validatePagination,
    ],
    commentController.getComments
);

export default commentRoutes;
