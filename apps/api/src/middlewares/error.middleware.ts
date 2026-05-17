import { Response, Request, NextFunction } from 'express';
/* 
    Les Middlewares (/middlewares)
    - S'exécutent entre la réception de la requête et la réponse.
    - Gèrent les tâches transversales : validation de données (avec Joi ou Zod), authentification JWT, et la gestion globale des erreurs.

    Le Middleware de Gestion d'Erreurs:
    - Centralise et structure toutes les réponses d'échecs de l'API.
*/

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Erreur interne du serveur";

    console.error("Érreur: ", message)

    // Gestion spécifique des erreurs de validation Zod de l'application
    if (err.name === "zodError") {
        return res.status(400).json({
            success: false,
            message: err.errors
        })
    }

    return res.status(statusCode).json({
        success: false,
        message
    })
}