import { AddMemberToProjectSchema, ProjectSchema } from "@repo/shared";
import { Router } from "express";
import { ProjecController } from "src/controllers/project.controller";
import { requireAuth } from "src/middlewares/auth.middleware";
import { processRequest } from "zod-express-middleware";

const projectRoutes: Router = Router();
const projectController = new ProjecController();

projectRoutes.post(
    '/project/register',
    [
        requireAuth,
        processRequest({ body: ProjectSchema }),
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
    [
        requireAuth,
        processRequest({ body: ProjectSchema }),
    ],
    projectController.update
);
projectRoutes.delete(
    '/project/:id',
    requireAuth,
    projectController.deletete
);
projectRoutes.post(
    '/project/add-new-member',
    [
        processRequest({body: AddMemberToProjectSchema}),
        requireAuth
    ],
    projectController.addNewMember
);

projectRoutes.post(
    '/project/remove-member',
    [
        processRequest({body: AddMemberToProjectSchema}),
        requireAuth
    ],
    projectController.removeMember
);

export default projectRoutes;