import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.hoisted ensures these are available when the vi.mock factory runs (which is hoisted)
const { mockFetchUsers, mockFetchUser, mockCreateUser, mockLogin } = vi.hoisted(() => ({
    mockFetchUsers: vi.fn(),
    mockFetchUser: vi.fn(),
    mockCreateUser: vi.fn(),
    mockLogin: vi.fn()
}));

vi.mock('src/services/user.service', () => {
    return {
        UserService: class {
            createUser = mockCreateUser;
            login = mockLogin;
            fetchUsers = mockFetchUsers;
            fetchUser = mockFetchUser;
        }
    };
});

// Import after mock setup
import { UserController } from 'src/controllers/user.controller';

// Helper to create mock Express request
const createMockReq = (overrides: Record<string, any> = {}) => ({
    body: {},
    params: {},
    headers: {},
    user: undefined,
    ...overrides
});

// Helper to create mock Express response
const createMockRes = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

describe('UserController -- getUsers', () => {
    let userController: InstanceType<typeof UserController>;

    beforeEach(() => {
        vi.clearAllMocks();
        userController = new UserController();
    });

    it('devrait retourner tous les utilisateurs avec status 200', async () => {
        // GIVEN
        const mockUsers = [
            { id: '1', name: 'Alice', email: 'alice@test.com', createdAt: new Date('2024-01-01') },
            { id: '2', name: 'Bob', email: 'bob@test.com', createdAt: new Date('2024-01-02') }
        ];
        mockFetchUsers.mockResolvedValue(mockUsers);

        const req = createMockReq();
        const res = createMockRes();

        // WHEN
        await userController.getUsers(req as any, res as any);

        // THEN
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockUsers
        });
    });

    it('devrait retourner success: true avec un tableau vide si aucun utilisateur', async () => {
        // GIVEN
        mockFetchUsers.mockResolvedValue([]);
        const req = createMockReq();
        const res = createMockRes();

        // WHEN
        await userController.getUsers(req as any, res as any);

        // THEN
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: []
        });
    });

    it('devrait appeler fetchUsers une seule fois', async () => {
        // GIVEN
        mockFetchUsers.mockResolvedValue([]);
        const req = createMockReq();
        const res = createMockRes();

        // WHEN
        await userController.getUsers(req as any, res as any);

        // THEN
        expect(mockFetchUsers).toHaveBeenCalledTimes(1);
    });

    it('devrait propager les erreurs du service', async () => {
        // GIVEN
        mockFetchUsers.mockRejectedValue(new Error('Service error'));
        const req = createMockReq();
        const res = createMockRes();

        // WHEN & THEN
        await expect(userController.getUsers(req as any, res as any)).rejects.toThrow('Service error');
    });
});

describe('UserController -- getSingleUser', () => {
    let userController: InstanceType<typeof UserController>;

    beforeEach(() => {
        vi.clearAllMocks();
        userController = new UserController();
    });

    it('devrait retourner un utilisateur par ID avec status 200', async () => {
        // GIVEN
        const mockUser = {
            id: 'user_123',
            name: 'Alice',
            email: 'alice@test.com',
            createdAt: new Date('2024-01-01')
        };
        mockFetchUser.mockResolvedValue(mockUser);

        const req = createMockReq({ params: { id: 'user_123' } });
        const res = createMockRes();

        // WHEN
        await userController.getSingleUser(req as any, res as any);

        // THEN
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockUser
        });
    });

    it("devrait extraire l'ID des paramètres de route et appeler fetchUser", async () => {
        // GIVEN
        const targetId = 'specific-id-xyz';
        const mockUser = { id: targetId, name: 'Test', email: 'test@test.com', createdAt: new Date() };
        mockFetchUser.mockResolvedValue(mockUser);

        const req = createMockReq({ params: { id: targetId } });
        const res = createMockRes();

        // WHEN
        await userController.getSingleUser(req as any, res as any);

        // THEN
        expect(mockFetchUser).toHaveBeenCalledWith(targetId);
        expect(mockFetchUser).toHaveBeenCalledTimes(1);
    });

    it("devrait propager les erreurs si l'utilisateur est introuvable", async () => {
        // GIVEN
        const notFoundError = new Error("L'utilisateur que vous rechercher n'existe pas !");
        (notFoundError as any).statusCode = 401;
        mockFetchUser.mockRejectedValue(notFoundError);

        const req = createMockReq({ params: { id: 'nonexistent_id' } });
        const res = createMockRes();

        // WHEN & THEN
        await expect(userController.getSingleUser(req as any, res as any)).rejects.toThrow(
            "L'utilisateur que vous rechercher n'existe pas !"
        );
    });

    it('devrait retourner success: true dans la réponse', async () => {
        // GIVEN
        mockFetchUser.mockResolvedValue({ id: '1', name: 'A', email: 'a@b.com', createdAt: new Date() });
        const req = createMockReq({ params: { id: '1' } });
        const res = createMockRes();

        // WHEN
        await userController.getSingleUser(req as any, res as any);

        // THEN
        const jsonCall = res.json.mock.calls[0][0];
        expect(jsonCall.success).toBe(true);
    });

    it("devrait retourner les données de l'utilisateur sans modification", async () => {
        // GIVEN
        const createdAt = new Date('2024-05-15');
        const mockUser = { id: 'u1', name: 'Carol', email: 'carol@example.com', createdAt };
        mockFetchUser.mockResolvedValue(mockUser);

        const req = createMockReq({ params: { id: 'u1' } });
        const res = createMockRes();

        // WHEN
        await userController.getSingleUser(req as any, res as any);

        // THEN
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: { id: 'u1', name: 'Carol', email: 'carol@example.com', createdAt }
        });
    });
});