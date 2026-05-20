/* 
    Le Middleware d'Authentification JWT
    Il protège les données privées sans ce système, n'importe qui pourrait deviner
    une URL (comme /api/users/me) et lire ou modifier les informations de nos utilisateurs.
    Avec le JWT, dès qu'un utilisateur se connecte, l'API lui donne un "badge numérique" (le token).
    Pour chaque requête suivante (ex: afficher son profil, passer une commande),
    le client (React/Next.js) envoie ce badge dans les entêtes HTTP.
    Le middleware requireAuth vérifie le badge. S'il est valide, l'accès est accordé ;
    sinon, la requête est bloquée instantanément avec une erreur 401 Unauthorized.
    Il identifie l'auteur d'une action (Le Contexte):
    Le JWT contient des données chiffrées appelées payload (exemple : l'ID, l'email et le nom de l'utilisateur).
    Une fois le token validé par le middleware, ces informations sont injectées directement dans l'objet req.user.
    Utilité concrète : Dans nos contrôleurs et services, nous n'avons plus besoin de demander au client "Qui es-tu ?"
    ou de lui faire confiance en recevant un ID dans le corps de la requête (ce qui serait une énorme faille de sécurité).
    Nous écrivons simplement req.user.id pour savoir exactement quel utilisateur est en train de faire l'action.
*/

import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// Ce middleware intercepte le jeton, le valide et bloque l'accès si nécessaire :
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req?.headers.authorization

    if (authHeader) {
        if (!authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                sucess: false,
                message: "Accès non autorisé : Token manquant"
            })
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, name: string }
            // On attache les données de l'utilisateur à la requête
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: "Accès non autorisé : Token invalide",
                mainError: error
            })
        }

    }
    res.status(401).json({
        success: false,
        message: "Accès non autorisé : Token invalide",
    })
}