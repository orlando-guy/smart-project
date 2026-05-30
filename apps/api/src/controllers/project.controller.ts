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

    async allUserProjects(req: Request, res: Response) {
        const data = await projectService.listUserProject(req.user.id)
        return res.status(201).json({
            success: true,
            data
        })
    }

    async getProjectDetail(req: Request, res: Response) {
        const { id: projectId } = req.params;
        const data = await projectService.fetchProjectDetail(projectId as string);
        return res.status(201).json({
            success: true,
            data
        })
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const updatedProject = await projectService.editProject(
            id as string,
            req.body
        );

        return res.status(201).json({
            success: true,
            data: updatedProject
        });
    }

    async deletete(req: Request, res: Response) {
        const { id } = req.params;
        const data = await projectService.deleteProject(id as string);

        return res.status(201).json({
            success: true,
            data
        })
    }
}