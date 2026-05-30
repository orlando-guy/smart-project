import { ProjectInput } from "@repo/shared";
import { Request, Response } from "express";
import { ProjectService } from "src/services/project.service";

const projectService = new ProjectService();

export class ProjecController {

    async register(req: Request<{}, {}, ProjectInput>, res: Response) {
        const newProject = await projectService.createProject(req.user.id, req.body);

        return res.status(201).json({
            succes: true,
            data: newProject
        })
    }
}