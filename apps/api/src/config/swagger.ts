import swaggerJsdoc from 'swagger-jsdoc';
import path from 'node:path';

// Détecte si le code s'exécute depuis le dossier de build (dist/build) ou src
const isProduction = process.env.NODE_ENV === 'production';
const fileExtension = isProduction ? 'js' : 'ts';
const baseDir = isProduction ? 'dist' : 'src'; // Selon le dossier de sortie TypeScript

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartProject API - Layered Architecture',
      version: '1.0.0',
      description: 'Documentation interactive de l\'API Node.js au sein du Monorepo',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:4000',
        description: 'Serveur local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT sous la forme : Bearer <votre_token>',
        },
      },
    },
  },
  // Recherche les annotations Swagger uniquement dans la couche d'interface (routes)
  apis: [
    path.join(process.cwd(), `${baseDir}/routes/**/*.${fileExtension}`),
    path.join(process.cwd(), `${baseDir}/infrastructure/types/**/*.${fileExtension}`),
    path.join(process.cwd(), `${baseDir}/infrastructure/docs/**/*.${fileExtension}`),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
