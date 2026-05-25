import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../middlewares/auth.middleware'

const JWT_SECRET = 'super_secret_key'

// Helper to create a valid JWT token for testing
const createToken = (payload: object, secret = JWT_SECRET) => {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};

// Helper to create mock Express request
const createMockReq = (overrides: Record<string, any> = {}) => ({
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

// Helper to create mock next function
const createMockNext = () => vi.fn();

describe('requireAuth middleware -- absence du header Authorization', () => {
    it('devrait retourner 401 quand aucun header Authorization n\'est fourni', () => {
        // GIVEN : Requête sans header Authorization
        const req = createMockReq({ headers: {} });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Accès non autorisé : Token invalide'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner 401 quand le header Authorization est undefined', () => {
        // GIVEN
        const req = createMockReq({ headers: { authorization: undefined } });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('ne devrait pas appeler next() quand aucun header n\'est fourni', () => {
        // GIVEN
        const req = createMockReq({ headers: {} });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN : next() ne doit JAMAIS être appelé sans token valide
        expect(next).not.toHaveBeenCalled();
    });
});

describe('requireAuth middleware -- header Authorization mal formaté', () => {
    it('devrait retourner 401 quand le token ne commence pas par "Bearer "', () => {
        // GIVEN : Le token n'utilise pas le schéma Bearer
        const req = createMockReq({
            headers: { authorization: 'Basic sometoken123' }
        });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner un message d\'erreur approprié pour un token manquant', () => {
        // GIVEN
        const req = createMockReq({
            headers: { authorization: 'Token xyz' }
        });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN : Le message d'erreur doit mentionner "Token manquant"
        expect(res.status).toHaveBeenCalledWith(401);
        const jsonCall = res.json.mock.calls[0][0];
        expect(jsonCall.message).toContain('Token manquant');
    });
});

describe('requireAuth middleware -- token JWT invalide', () => {
    it('devrait retourner 401 avec un token JWT expiré ou invalide', () => {
        // GIVEN : Token forgé avec une mauvaise clé secrète
        const invalidToken = jwt.sign({ id: 'user1', email: 'a@b.com', name: 'A' }, 'wrong_secret');
        const req = createMockReq({
            headers: { authorization: `Bearer ${invalidToken}` }
        });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner un message "Token invalide" pour un JWT malformé', () => {
        // GIVEN
        const req = createMockReq({
            headers: { authorization: 'Bearer not.a.valid.jwt.token' }
        });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN
        expect(res.status).toHaveBeenCalledWith(401);
        const jsonCall = res.json.mock.calls[0][0];
        expect(jsonCall.message).toContain('Token invalide');
    });

    it('devrait retourner success: false pour un token invalide', () => {
        // GIVEN
        const req = createMockReq({
            headers: { authorization: 'Bearer invalid.jwt.here' }
        });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN
        expect(res.status).toHaveBeenCalledWith(401);
        const jsonCall = res.json.mock.calls[0][0];
        expect(jsonCall.success).toBe(false);
    });
});

describe('requireAuth middleware -- token JWT valide', () => {
    it('devrait appeler next() avec un token valide', () => {
        // GIVEN : Token JWT valide signé avec la bonne clé
        const payload = { id: 'user_123', email: 'test@example.com', name: 'Test User' };
        const token = createToken(payload);
        const req = createMockReq({
            headers: { authorization: `Bearer ${token}` }
        });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalledWith(401);
    });

    it('devrait attacher les données utilisateur décodées à req.user', () => {
        // GIVEN
        const payload = { id: 'user_456', email: 'alice@example.com', name: 'Alice' };
        const token = createToken(payload);
        const req = createMockReq({
            headers: { authorization: `Bearer ${token}` }
        });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN : req.user doit contenir les informations du payload
        expect((req as any).user).toBeDefined();
        expect((req as any).user.id).toBe('user_456');
        expect((req as any).user.email).toBe('alice@example.com');
        expect((req as any).user.name).toBe('Alice');
    });

    it('ne devrait pas envoyer de réponse HTTP quand le token est valide', () => {
        // GIVEN
        const payload = { id: 'user_789', email: 'bob@example.com', name: 'Bob' };
        const token = createToken(payload);
        const req = createMockReq({
            headers: { authorization: `Bearer ${token}` }
        });
        const res = createMockRes();
        const next = createMockNext();

        // WHEN
        requireAuth(req as any, res as any, next);

        // THEN : Aucune réponse HTTP ne doit être envoyée
        expect(res.json).not.toHaveBeenCalled();
    });
});