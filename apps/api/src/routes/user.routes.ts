import { Router } from "express";
import { processRequest } from 'zod-express-middleware';
import { UserController } from "src/controllers/user.controller";
import { UserSchema, LoginUserSchema  } from "@repo/shared";
import { requireAuth } from "src/middlewares/auth.middleware";

const userRoutes: Router = Router();
const userController = new UserController();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, password]
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               name: { type: string, example: "John Doe" }
 *               password: { type: string, example: "SecurePassword123!" }
 *     responses:
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/User' }
 *       400:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 */
userRoutes.post(
    '/auth/register',
    processRequest({body: UserSchema}),
    userController.register
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "SecurePassword123!" }
 *     responses:
 *       200:
 *         description: Logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string, example: "eyJhbGciOi..." }
 *                     user: { $ref: '#/components/schemas/User' }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       422:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 */
userRoutes.post(
    '/auth/login',
   processRequest({body: LoginUserSchema}),
   userController.login
);

/**
 * @openapi
 * /all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
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
 *       500:
 *         $ref: '#/components/responses/StandardError'
 */
userRoutes.get('/all', requireAuth, userController.getUsers)

/**
 * @openapi
 * /me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/User' }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 */
userRoutes.get('/me', requireAuth, userController.getProfile);

/**
 * @openapi
 * /{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "user-123" }
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/User' }
 *       401:
 *         $ref: '#/components/responses/StandardError'
 *       404:
 *         $ref: '#/components/responses/StandardError'
 *       500:
 *         $ref: '#/components/responses/StandardError'
 */
userRoutes.get('/:id', requireAuth, userController.getSingleUser)

export default userRoutes;
