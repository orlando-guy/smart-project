import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '../services/user.service'
import { UserRepository } from '../repositories/user.repository'

// 1. on demande a vi d'intercepter et de simuler la classe UserRepository
vi.mock('../repositories/user.repository.ts', () => {
    return {
        UserRepository: vi.fn().mockImplementation(() => {
            return {
                findByEmail: vi.fn(),
                findById: vi.fn(),
                create: vi.fn(),
                findAll: vi.fn()
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

describe('UserService -- fetchUsers', () => {
    let userService: UserService;
    let mockUserRepository: any;

    beforeEach(() => {
        vi.clearAllMocks()
        userService = new UserService()
        mockUserRepository = (userService as any).userRepository;
    });

    it('devrait retourner la liste de tous les utilisateurs', async () => {
        // GIVEN : La base de données contient des utilisateurs
        const mockUsers = [
            { id: 'user_1', email: 'alice@example.com', name: 'Alice', password: 'hashed_1', createdAt: new Date('2024-01-01') },
            { id: 'user_2', email: 'bob@example.com', name: 'Bob', password: 'hashed_2', createdAt: new Date('2024-01-02') }
        ];
        mockUserRepository.findAll.mockResolvedValue(mockUsers);

        // WHEN
        const result = await userService.fetchUsers();

        // THEN
        expect(result).toEqual(mockUsers);
        expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('devrait retourner un tableau vide si aucun utilisateur existe', async () => {
        // GIVEN
        mockUserRepository.findAll.mockResolvedValue([]);

        // WHEN
        const result = await userService.fetchUsers();

        // THEN
        expect(result).toEqual([]);
        expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('devrait propager les erreurs du repository', async () => {
        // GIVEN
        mockUserRepository.findAll.mockRejectedValue(new Error('Erreur base de données'));

        // WHEN & THEN
        await expect(userService.fetchUsers()).rejects.toThrow('Erreur base de données');
    });
});

describe('UserService -- fetchUser', () => {
    let userService: UserService;
    let mockUserRepository: any;

    beforeEach(() => {
        vi.clearAllMocks()
        userService = new UserService()
        mockUserRepository = (userService as any).userRepository;
    });

    it('devrait retourner un utilisateur existant par son ID', async () => {
        // GIVEN
        const mockUser = {
            id: 'user_abc',
            email: 'alice@example.com',
            name: 'Alice',
            password: 'hashed_password',
            createdAt: new Date('2024-06-01')
        };
        mockUserRepository.findById.mockResolvedValue(mockUser);

        // WHEN
        const result = await userService.fetchUser('user_abc');

        // THEN
        expect(result).toEqual({
            id: 'user_abc',
            email: 'alice@example.com',
            name: 'Alice',
            createdAt: mockUser.createdAt
        });
        expect(mockUserRepository.findById).toHaveBeenCalledWith('user_abc');
        expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('ne devrait pas retourner le mot de passe dans la réponse', async () => {
        // GIVEN
        const mockUser = {
            id: 'user_xyz',
            email: 'test@example.com',
            name: 'Test User',
            password: 'secret_hash',
            createdAt: new Date('2024-03-15')
        };
        mockUserRepository.findById.mockResolvedValue(mockUser);

        // WHEN
        const result = await userService.fetchUser('user_xyz');

        // THEN : Le mot de passe ne doit pas être exposé
        expect(result).not.toHaveProperty('password');
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('createdAt');
    });

    it("devrait lever une erreur avec statusCode 401 si l'utilisateur n'existe pas", async () => {
        // GIVEN : L'ID ne correspond à aucun utilisateur
        mockUserRepository.findById.mockResolvedValue(null);

        // WHEN & THEN
        await expect(userService.fetchUser('nonexistent_id')).rejects.toThrow(
            "L'utilisateur que vous rechercher n'existe pas !"
        );
    });

    it("devrait attacher un statusCode 401 à l'erreur quand l'utilisateur n'existe pas", async () => {
        // GIVEN
        mockUserRepository.findById.mockResolvedValue(null);

        // WHEN
        let caughtError: any;
        try {
            await userService.fetchUser('nonexistent_id');
        } catch (err) {
            caughtError = err;
        }

        // THEN
        expect(caughtError).toBeDefined();
        expect(caughtError.statusCode).toBe(401);
    });

    it('devrait propager les erreurs du repository', async () => {
        // GIVEN
        mockUserRepository.findById.mockRejectedValue(new Error('DB connection failed'));

        // WHEN & THEN
        await expect(userService.fetchUser('any_id')).rejects.toThrow('DB connection failed');
    });

    it('devrait appeler findById avec le bon identifiant', async () => {
        // GIVEN
        const targetId = 'specific-uuid-1234';
        const mockUser = {
            id: targetId,
            email: 'user@test.com',
            name: 'Test',
            password: 'hash',
            createdAt: new Date()
        };
        mockUserRepository.findById.mockResolvedValue(mockUser);

        // WHEN
        await userService.fetchUser(targetId);

        // THEN
        expect(mockUserRepository.findById).toHaveBeenCalledWith(targetId);
    });
});
