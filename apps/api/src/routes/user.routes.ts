import { Router } from "express";
import { processRequest } from 'zod-express-middleware'; // zod-express-middleware : Facilite l'intégration de Zod directement dans les routes Express.
import { UserController } from "src/controllers/user.controller";
import { UserSchema, LoginUserSchema  } from "@repo/shared";
import { requireAuth } from "src/middlewares/auth.middleware";

/* 
    Les Routes (/routes)
    - Cartographient les URL vers les contrôleurs correspondants.
    - Ne contiennent aucune logique métier.
    - Appliquent les middlewares spécifiques à chaque route (ex: authentification).
*/

const userRoutes: Router = Router();
const userController = new UserController();

// Le middleware processRequest valide automatiquement la requête selon le schéma Zod

// Routes Publiques
userRoutes.post(
    '/register',
    processRequest({body: UserSchema}),
    userController.register
);
userRoutes.post(
    '/login',
   processRequest({body: LoginUserSchema}),
   userController.login
);

userRoutes.get('/all', userController.getUsers)

// Routes Protégées
userRoutes.get('/me', requireAuth, userController.getProfile);

userRoutes.get('/:id', userController.getSingleUser)

export default userRoutes;