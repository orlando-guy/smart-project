import { Request, Response } from 'express';
import { UserService } from 'src/services/user.service';
import { type User, LoginUserInput } from '@repo/shared';

/* 
    Les Contrôleurs (/controllers)
    - Récupèrent les données de la requête HTTP (req.params, req.body).
    - Appellent les services nécessaires pour traiter ces données.
    - Renvoient la réponse HTTP (res.status().json()) avec le bon code d'état
*/

export class UserController {
    constructor(
        private readonly userService = new UserService()
    ) {}

    register = async (req: Request<{}, {}, User>, res: Response) => {
        // Les données de req.body sont déjà validées et typées grâce au middleware
        const newUser = await this.userService.createUser(req.body);

        return res.status(201).json({
            success: true,
            data: newUser
        })
    }

    login = async (req: Request<{}, {}, LoginUserInput>, res: Response) => {
        const data = await this.userService.login(req.body);
        return res.status(200).json({
            success: true,
            data
        })
    }

    getProfile = async (req: Request, res: Response) => {
        // req.user est disponible grâce au middleware requireAuth
        return res.status(200).json({
            success: true,
            data: req.user
        })
    }

    getSingleUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.userService.fetchUser(id as string);
        return res.status(200).json({
            success: true,
            data
        }) 
    }

    getUsers = async (req: Request, res: Response) => {
        const data = await this.userService.fetchUsers();
        
        return res.status(200).json({
            success: true,
            data
        })
    }
}