import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserRepository } from '../repositories/user.repository'

const { mockFindMany, mockFindUnique, mockCreate } = vi.hoisted(() => ({
    mockFindMany: vi.fn(),
    mockFindUnique: vi.fn(),
    mockCreate: vi.fn()
}));

// Mock the @repo/database module to avoid real DB connections
vi.mock('@repo/database', () => {
    return {
        getPrisma: vi.fn().mockReturnValue({
            user: {
                findUnique: mockFindUnique,
                create: mockCreate,
                findMany: mockFindMany
            }
        })
    };
});

describe('UserRepository -- findAll', () => {
    let userRepository: UserRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        userRepository = new UserRepository();
    });

    it('devrait appeler prisma.user.findMany()', async () => {
        // GIVEN
        mockFindMany.mockResolvedValue([]);

        // WHEN
        await userRepository.findAll();

        // THEN
        expect(mockFindMany).toHaveBeenCalledTimes(1);
    });

    it('devrait retourner tous les utilisateurs de la base de données', async () => {
        // GIVEN
        const mockUsers = [
            { id: 'user_1', email: 'alice@example.com', name: 'Alice', password: 'hash1', createdAt: new Date('2024-01-01') },
            { id: 'user_2', email: 'bob@example.com', name: 'Bob', password: 'hash2', createdAt: new Date('2024-01-02') },
            { id: 'user_3', email: 'carol@example.com', name: 'Carol', password: 'hash3', createdAt: new Date('2024-01-03') }
        ];
        mockFindMany.mockResolvedValue(mockUsers);

        // WHEN
        const result = await userRepository.findAll();

        // THEN
        expect(result).toEqual(mockUsers);
        expect(result).toHaveLength(3);
    });

    it('devrait retourner un tableau vide si aucun utilisateur en base', async () => {
        // GIVEN
        mockFindMany.mockResolvedValue([]);

        // WHEN
        const result = await userRepository.findAll();

        // THEN
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
    });

    it('devrait retourner un seul utilisateur si un seul existe', async () => {
        // GIVEN
        const singleUser = [
            { id: 'only_user', email: 'solo@example.com', name: 'Solo', password: 'hash', createdAt: new Date() }
        ];
        mockFindMany.mockResolvedValue(singleUser);

        // WHEN
        const result = await userRepository.findAll();

        // THEN
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('only_user');
    });

    it('devrait propager les erreurs Prisma', async () => {
        // GIVEN : La base de données renvoie une erreur
        mockFindMany.mockRejectedValue(new Error('Connection refused'));

        // WHEN & THEN
        await expect(userRepository.findAll()).rejects.toThrow('Connection refused');
    });

    it('devrait appeler findMany sans arguments (pas de filtre)', async () => {
        // GIVEN
        mockFindMany.mockResolvedValue([]);

        // WHEN
        await userRepository.findAll();

        // THEN : findMany doit être appelé sans arguments pour récupérer tous les utilisateurs
        expect(mockFindMany).toHaveBeenCalledWith();
    });

    it('devrait conserver les données retournées par Prisma intactes', async () => {
        // GIVEN : Régression - s'assurer que les données ne sont pas transformées
        const createdAt = new Date('2024-06-15T10:30:00Z');
        const mockUsers = [
            { id: 'abc123', email: 'test@domain.com', name: 'Test Name', password: 'hashedpw', createdAt }
        ];
        mockFindMany.mockResolvedValue(mockUsers);

        // WHEN
        const result = await userRepository.findAll();

        // THEN : Les données sont retournées telles quelles (y compris le mot de passe haché)
        expect(result[0]).toEqual({
            id: 'abc123',
            email: 'test@domain.com',
            name: 'Test Name',
            password: 'hashedpw',
            createdAt
        });
    });
});
