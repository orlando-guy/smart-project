import { type User, UserResponse, LoginUserInput } from '@repo/shared';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { env } from '../config/env';

/* 
    Les Services (/services)
    - Contiennent toute la logique métier essentielle de l'application.
    - Communiquent avec les modèles de base de données.
    - Sont totalement indépendants du framework Express (ils ne manipulent ni req ni res).
    - Faciles à tester unitairement.
*/

type LoginResponse = {
    user: Omit<User, 'password'> & {
        id: string;
    }
    token: string
}

const JWT_SECRET = env.JWT_SECRET;

export class UserService {
    private readonly userRepository = new UserRepository()
    // Simulation d'une base de données ou d'un ORM (prisma/mogoose)
    async createUser(userData: User): Promise<UserResponse> {
        // Exemple de logique métier (Vérification existence, Hashage du mot de passe...)
        const existingUser = await this.userRepository.findByEmail(userData.email)

        if (existingUser) {
            const duplicateError = new Error('Cet email est déjà utilisé') as Error & {
                statusCode?: number;
            };

            duplicateError.statusCode = 400; // Bad Request
            throw duplicateError;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10)

        const user = await this.userRepository.create({
            ...userData,
            hashedPassword
        })

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }
    }

    async login(data: LoginUserInput): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            const error = new Error('Identifiant invalide');
            (error as any).statusCode = 422;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Mot de passe invalide');
            (error as any).statusCode = 422;
            throw error;
        }

        const filteredUser = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        
        // Génération du Token JWT
        const token = jwt.sign(
            filteredUser,
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        return {
            user: filteredUser,
            token
        }
    }

    async fetchUsers() {
        return await this.userRepository.findAll();
    }

    async fetchUser(id: string): Promise<UserResponse> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            const error = new Error('L\'utilisateur que vous rechercher n\'existe pas !');
            (error as any).statusCode = 404;
            throw error;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };
    }
}