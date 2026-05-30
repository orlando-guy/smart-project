import { ProjectSchema } from "@repo/shared";
import { Router } from "express";
import { ProjecController } from "src/controllers/project.controller";
import { requireAuth } from "src/middlewares/auth.middleware";
import { processRequest } from "zod-express-middleware";

const projectRoutes: Router = Router();
const projectController = new ProjecController();

projectRoutes.post(
    '/project/register',
    [
        processRequest({body: ProjectSchema}),
        requireAuth
    ],
    projectController.register
);

projectRoutes.get(
    '/projects',
    requireAuth,
    projectController.allUserProjects
);
projectRoutes.get(
    '/project/:id',
    requireAuth,
    projectController.getProjectDetail
);
projectRoutes.put(
    '/project/:id',
    requireAuth,
    projectController.update
);


export default projectRoutes;