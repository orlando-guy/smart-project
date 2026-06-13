import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { GetProjectTasksUseCase } from "../domain/usecases/GetProjectTasksUseCase";
import { UpdateTaskStatusUseCase } from "../domain/usecases/UpdateTaskStatusUseCase";

const taskRepository = new TaskRepository();

export const getProjectTasksUseCase = new GetProjectTasksUseCase(taskRepository);
export const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(taskRepository);
