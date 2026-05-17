import { User } from '@repo/database';

/* 
 # Authentification et Sécurisation de l'API :
*/

// Pour attacher l'utilisateur authentifié à l'objet req d'Express :
declare global {
    namespace Express {
        interface Request {
            user?: Omit<User, 'password', 'createdAt'>
        }
    }
}