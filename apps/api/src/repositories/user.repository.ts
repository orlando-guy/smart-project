import { User, getPrisma } from '@repo/database';
import { User as UserType } from '@repo/shared';

export class UserRepository {
    readonly #prisma = getPrisma()

    // Trouver un utiisateur par son email
    async findByEmail(email: string): Promise<User | null> {
        return this.#prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() }
        })
    }

    // Trouver un utilisateur par son ID
    async findById(id: string): Promise<User | null> {
        return this.#prisma.user.findUnique({
            where: { id: id }
        })
    }

    // créer un utilisateur en base de données
    async create(userData: UserType & { hashedPassword: string }): Promise<User> {
        return this.#prisma.user.create({
            data: {
                email: userData.email.trim().toLowerCase(),
                name: userData.name.trim(),
                password: userData.hashedPassword
            }
        })
    }

    async findAll(): Promise<User[] | []> {
        return this.#prisma.user.findMany();
    }
}
