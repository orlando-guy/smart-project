import { TaskInput } from "@repo/shared";
import { Request, Response } from "express";
import { TaskService } from "src/services/task.service";

export class TaskController {
    constructor(
        private readonly taskService = new TaskService()
    ) {}

    create = async (req: Request<{}, {}, TaskInput>, res: Response) => {
        const newTask = await this.taskService.createTask(req.body);

        return res.status(201).json({
            success: true,
            data: newTask
        });
    }

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.taskService.deleteTask(id as string, req.user.id);

        return res.status(200).json(result);
    }

    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const updatedTask = await this.taskService.updateTask(id as string, req.user.id, req.body);

        return res.status(200).json({
            success: true,
            data: updatedTask
        });
    }

    updateStatus = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { statut } = req.body;
        const updatedTask = await this.taskService.updateTaskStatus(id as string, req.user.id, statut);

        return res.status(200).json({
            success: true,
            data: updatedTask
        });
    }

    getProjectTasks = async (req: Request, res: Response) => {
        const { projectId } = req.params;
        const tasks = await this.taskService.getProjectTasks(projectId as string);

        return res.status(200).json({
            success: true,
            data: tasks
        });
    }
}
