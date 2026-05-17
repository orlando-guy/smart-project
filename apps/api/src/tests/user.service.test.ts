import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '../services/user.service'
import { UserRepository } from '../repositories/user.repository'

// 1. on demande a vi d'intercepter et de simuler la classe UserRepository
vi.mock('../repositories/user.repository.ts', () => {
    return {
        UserRepository: vi.fn().mockImplementation(() => {
            return {
                findByEmail: vi.fn(),
                create: vi.fn()
            };
        })
    };
});

describe('UserService -- Registry', () => {
    let userService: UserService;
    let mockUserRepository: any;

    beforeEach(() => {
        vi.clearAllMocks()
        userService = new UserService()
        // On récupère l'instance simulée pour configurer ses réponses selon les tests
        mockUserRepository = (userService as any).userRepository;
    });

    it('devrait inscrire un utilisateur avec succès', async () => {
        // GIVEN : L'email n'existe pas en base de données
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue({
            id: 'user_123',
            email: 'test@example.com',
            name: 'John Doe',
            password: 'hashed_password_123'
        });

        const userData = {
            email: 'test@example.com',
            name: 'John Doe',
            password: 'Password_123'
        }

        // WHEN : On appelle la méthode register du service
        const result = await userService.createUser(userData)

        // THEN : On vérifie que le résultat renvoie les bonnes informations sans le mot de passe
        expect(result).toEqual({
            id: "user_123",
            email: "text@example.com",
            name: 'John Doe'
        });
        expect(mockUserRepository.create).toHaveBeenCalledTimes(1)
    });

    it("devrait lever une érreur si l'adresse email est déjà utilisé", async () => {
        // GIVEN : L'email existe déjà en base de données
        mockUserRepository.findByEmail.mockResolvedValue({
            id: "existing_user",
            email: "deja.pris@email.com"
        });

        const userData = {
            email: 'deja.pris@email.com',
            name: 'Anonyme',
            password: 'password123',
        }

        // WHEN & THEN : On vérifie que le service rejette la demande avec la bonne erreur
        expect(userService.createUser(userData)).rejects.toThrow('Cet email est déjà utilisé')
        // On s'assure que la création n'a jamais été tentée
        expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
})