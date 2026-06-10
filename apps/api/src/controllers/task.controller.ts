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
}
