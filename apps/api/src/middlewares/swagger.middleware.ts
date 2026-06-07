import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';

const swaggerRouter: Router = Router();

// Configure l'interface graphique Swagger UI
swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "SmartProject API Documentation",
    swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
    }
}));

// Optionnel : Exposer le schéma JSON brut pour Next.js si besoin
swaggerRouter.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export default swaggerRouter;
