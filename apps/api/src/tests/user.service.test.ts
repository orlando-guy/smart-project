import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '../services/user.service'
import { UserRepository } from '../repositories/user.repository'

vi.mock('../repositories/user.repository')

describe('UserService -- Registry', () => {
        let userService: UserService;
        let mockUserRepository: any;

        beforeEach(() => {
                vi.clearAllMocks()
                mockUserRepository = UserRepository.prototype;
                userService = new UserService(mockUserRepository);
        });

        it('devrait inscrire un utilisateur avec succès', async () => {
                const createdAt = new Date();
                vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
                vi.mocked(mockUserRepository.create).mockResolvedValue({
                        id: 'user_123',
                        email: 'test@example.com',
                        name: 'John Doe',
                        password: 'hashed_password_123',
                        createdAt: createdAt
                });

                const userData = {
                        email: 'test@example.com',
                        name: 'John Doe',
                        password: 'Password_123'
                }

                // WHEN : On appelle la méthode register du service
                const result = await userService.createUser(userData as any)
                // THEN : On vérifie que le résultat renvoie les bonnes informations
                expect(result).toEqual({
                        id: 'user_123',
                        email: 'test@example.com',
                        name: 'John Doe',
                        password: 'Password_123',
                        createdAt: createdAt
                });
                expect(mockUserRepository.create).toHaveBeenCalled();
        });

        it("devrait lever une érreur si l'adresse email est déjà utilisé", async () => {
                vi.mocked(mockUserRepository.findByEmail).mockResolvedValue({
                        id: "existing_user",
                        email: "deja.pris@email.com"
                });

                const userData = {
                        email: 'deja.pris@email.com',
                        name: 'John Doe',
                        password: 'Password_123'
                }

                await expect(userService.createUser(userData as any))
                        .rejects.toThrow('Cet email est déjà utilisé');
        });
});

describe('UserService -- fetchUsers', () => {
        let userService: UserService;
        let mockUserRepository: any;

        beforeEach(() => {
                vi.clearAllMocks()
                mockUserRepository = UserRepository.prototype;
                userService = new UserService(mockUserRepository)
        });

        it('devrait retourner la liste de tous les utilisateurs', async () => {
                const mockUsers = [
                        { id: 'user_1', email: 'alice@example.com', name: 'Alice', password: 'hashed_1', createdAt: new Date('2024-01-01') },
                        { id: 'user_2', email: 'bob@example.com', name: 'Bob', password: 'hashed_2', createdAt: new Date('2024-01-02') }
                ];
                vi.mocked(mockUserRepository.findAll).mockResolvedValue(mockUsers);

                const result = await userService.fetchUsers();

                // THEN
                expect(result).toHaveLength(2);
                expect(result[0]).not.toHaveProperty('password');
                expect(result[1].name).toBe('Bob');
        });

        it('devrait retourner un tableau vide si aucun utilisateur existe', async () => {
                // GIVEN
                vi.mocked(mockUserRepository.findAll).mockResolvedValue([]);

                // WHEN
                const result = await userService.fetchUsers();
                expect(result).toEqual([]);
        });

        it('devrait propager les erreurs du repository', async () => {
                // GIVEN
                vi.mocked(mockUserRepository.findAll).mockRejectedValue(new Error('Erreur base de données'));

                // WHEN & THEN
                await expect(userService.fetchUsers()).rejects.toThrow('Erreur base de données');
        });
});

describe('UserService -- fetchUser', () => {
        let userService: UserService;
        let mockUserRepository: any;

        beforeEach(() => {
                vi.clearAllMocks()
                mockUserRepository = UserRepository.prototype;
                userService = new UserService(mockUserRepository)
        });

        it('devrait retourner un utilisateur existant par son ID', async () => {
                const mockUser = {
                        id: 'user_123',
                        email: 'test@example.com',
                        name: 'Test User',
                        password: 'hashed_password',
                        createdAt: new Date('2024-06-01')
                };
                vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);

                // WHEN
                const result = await userService.fetchUser('user_123');

                expect(result).toEqual({
                        id: 'user_123',
                        email: 'test@example.com',
                        name: 'Test User',
                        createdAt: mockUser.createdAt
                });
        });

        it('ne devrait pas retourner le mot de passe dans la réponse', async () => {
                const mockUser = {
                        id: 'u1',
                        email: 'u1@test.com',
                        name: 'U1',
                        password: 'SECRET_PASSWORD',
                        createdAt: new Date('2024-03-15')
                };
                vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);

                // WHEN
                const result = await userService.fetchUser('u1');

                // THEN
                expect(result).not.toHaveProperty('password');
        });

        it("devrait lever une erreur avec statusCode 404 si l'utilisateur n'existe pas", async () => {
                // GIVEN : L'ID ne correspond à aucun utilisateur
                vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

                // WHEN & THEN
                await expect(userService.fetchUser('unknown_id'))
                        .rejects.toThrow("L'utilisateur que vous rechercher n'existe pas !");
        });

        it("devrait attacher un statusCode 404 à l'erreur quand l'utilisateur n'existe pas", async () => {
                // GIVEN
                vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

                // WHEN & THEN
                await expect(userService.fetchUser('unknown_id')).rejects.toMatchObject({
                        message: "L'utilisateur que vous rechercher n'existe pas !",
                        statusCode: 404
                });
        });

        it('devrait propager les erreurs du repository', async () => {
                // GIVEN
                vi.mocked(mockUserRepository.findById).mockRejectedValue(new Error('DB connection failed'));

                // WHEN & THEN
                await expect(userService.fetchUser('any_id')).rejects.toThrow('DB connection failed');
        });

        it('devrait appeler findById avec le bon identifiant', async () => {
                // GIVEN
                const userId = 'target_id';
                const mockUser = {
                        id: userId,
                        email: 'target@test.com',
                        name: 'Target',
                        password: 'pass',
                        createdAt: new Date()
                };
                vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);

                // WHEN
                await userService.fetchUser(userId);

                // THEN
                expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        });
});
