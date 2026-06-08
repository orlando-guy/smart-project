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
    async createUser(userData: User): Promise<UserResponse & { password: string }> {
        const normalizedUserData = {
            ...userData,
            name: userData.name.trim(),
            email: userData.email.trim().toLowerCase(),
        };
        // Exemple de logique métier (Vérification existence, Hashage du mot de passe...)
        const existingUser = await this.userRepository.findByEmail(normalizedUserData.email)

        if (existingUser) {
            const duplicateError = new Error('Cet email est déjà utilisé') as Error & {
                statusCode?: number;
            };

            duplicateError.statusCode = 400; // Bad Request
            throw duplicateError;
        }

        const hashedPassword = await bcrypt.hash(normalizedUserData.password, 10)

        const user = await this.userRepository.create({
            ...normalizedUserData,
            hashedPassword
        })

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: normalizedUserData.password,
            createdAt: user.createdAt
        }
    }

    async login(data: LoginUserInput): Promise<LoginResponse> {
        const normalizedLoginData = {
            ...data,
            email: data.email.trim().toLowerCase(),
        };

        const user = await this.userRepository.findByEmail(normalizedLoginData.email);
        if (!user) {
            const error = new Error('E-mail ou mot de passe invalide');
            (error as any).statusCode = 422;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(normalizedLoginData.password, user.password);
        if (!isPasswordValid) {
            const error = new Error('E-mail ou mot de passe invalide');
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
        const users = await this.userRepository.findAll();
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }));
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
