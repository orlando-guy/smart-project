import { ProjectInput } from "@repo/shared";
import { Request, Response } from "express";
import { ProjectService } from "src/services/project.service";

type AddNewMemberInput = {
    projectId: string,
    newMemberId: string
}

export class ProjecController {
    constructor(
        private readonly projectService = new ProjectService()
    ) {}

    async register(req: Request<{}, {}, ProjectInput>, res: Response) {
        const newProject = await this.projectService.createProject(req.user.id, req.body);

        return res.status(201).json({
            succes: true,
            data: newProject
        })
    }

    async allUserProjects(req: Request, res: Response) {
        const data = await this.projectService.listUserProject(req.user.id);
        return res.status(200).json({
            success: true,
            data
        })
    }

    async getProjectDetail(req: Request, res: Response) {
        const { id } = req.params;
        const data = await this.projectService.fetchProjectDetail(id as string);

        return res.status(200).json({
            success: true,
            data
        })
    }

    async update(req: Request<{ id: string }, {}, ProjectInput>, res: Response) {
        const data = await this.projectService.editProject(req.params.id as string, req.body);

        return res.status(200).json({
            success: true,
            data
        })
    }

    async deletete(req: Request, res: Response) {
        const data = await this.projectService.deleteProject(req.params.id as string);

        return res.status(200).json({
            success: true,
            data
        })
    }

    async addNewMember(req: Request<{}, {}, AddNewMemberInput>, res: Response) {
        const data = await this.projectService.addMemberToProject(req.user.id, req.body.projectId, req.body.newMemberId);

        return res.status(201).json({
            success: true,
            data
        });
    }
}
