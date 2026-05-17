import { Request, Response } from 'express';
import { UserService } from 'src/services/user.service';
import { type User, LoginUserInput } from '@repo/shared';

/* 
    Les Contrôleurs (/controllers)
    - Récupèrent les données de la requête HTTP (req.params, req.body).
    - Appellent les services nécessaires pour traiter ces données.
    - Renvoient la réponse HTTP (res.status().json()) avec le bon code d'état
*/

const userService = new UserService()

export class UserController {
    async register(req: Request<{}, {}, User>, res: Response) {
        console.log(req.body)
        // Les données de req.body sont déjà validées et typées grâce au middleware
        const newUser = await userService.createUser(req.body);

        return res.status(201).json({
            success: true,
            data: newUser
        })
    }

    async login(req: Request<{}, {}, LoginUserInput>, res: Response) {
        const data = await userService.login(req.body);
        return res.status(200).json({
            success: true,
            data
        })
    }

    async getProfile(req: Request, res: Response) {
        // req.user est disponible grâce au middleware requireAuth
        return res.status(200).json({
            success: true,
            data: req.user
        })
    }
}