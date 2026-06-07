import { AddMemberToProjectSchema, ProjectSchema } from "@repo/shared";
import { Router } from "express";
import { ProjecController } from "src/controllers/project.controller";
import { requireAuth } from "src/middlewares/auth.middleware";
import { processRequest } from "zod-express-middleware";

const projectRoutes: Router = Router();
const projectController = new ProjecController();

/**
 * @openapi
 * /project/register:
 *   post:
 *     summary: Register a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string, example: "Alpha Project" }
 *               description: { type: string, example: "Description for project" }
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Project' }
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 */
projectRoutes.post(
    '/project/register',
    [
        requireAuth,
        processRequest({ body: ProjectSchema }),
    ],
    projectController.register
);

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Project' }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 */
projectRoutes.get(
    '/projects',
    requireAuth,
    projectController.allUserProjects
);

/**
 * @openapi
 * /project/{id}:
 *   get:
 *     summary: Get project details
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Project' }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 */
projectRoutes.get(
    '/project/:id',
    requireAuth,
    projectController.getProjectDetail
);

/**
 * @openapi
 * /project/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
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
 *               title: { type: string, example: "Updated Title" }
 *               description: { type: string, example: "Updated Description" }
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Project' }
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 */
projectRoutes.put(
    '/project/:id',
    [
        requireAuth,
        processRequest({ body: ProjectSchema }),
    ],
    projectController.update
);

/**
 * @openapi
 * /project/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *     responses:
 *       200:
 *         description: Project deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 */
projectRoutes.delete(
    '/project/:id',
    requireAuth,
    projectController.deletete
);

/**
 * @openapi
 * /project/add-new-member:
 *   post:
 *     summary: Add a new member to a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, newMemberId]
 *             properties:
 *               projectId: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *               newMemberId: { type: string, example: "user-456" }
 *     responses:
 *       201:
 *         description: Member added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       403:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 *       409:
 *         $ref: '#/components/responses/StandardError'
 */
projectRoutes.post(
    '/project/add-new-member',
    [
        processRequest({body: AddMemberToProjectSchema}),
        requireAuth
    ],
    projectController.addNewMember
);

/**
 * @openapi
 * /project/remove-member:
 *   post:
 *     summary: Remove a member from a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, newMemberId]
 *             properties:
 *               projectId: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *               newMemberId: { type: string, example: "user-456" }
 *     responses:
 *       200:
 *         description: Member removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Membre retiré avec succès" }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       403:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 */
projectRoutes.post(
    '/project/remove-member',
    [
        processRequest({body: AddMemberToProjectSchema}),
        requireAuth
    ],
    projectController.removeMember
);

/**
 * @openapi
 * /project/{id}/members:
 *   get:
 *     summary: Get project members
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "550e8400-e29b-41d4-a716-446655440000" }
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 */
projectRoutes.get(
    '/project/:id/members',
    requireAuth,
    projectController.getProjectMembers
);

export default projectRoutes;
