import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { GetProjectTasksUseCase } from "../domain/usecases/GetProjectTasksUseCase";
import { UpdateTaskStatusUseCase } from "../domain/usecases/UpdateTaskStatusUseCase";
import { CreateTaskUseCase } from "../domain/usecases/CreateTaskUseCase";

const taskRepository = new TaskRepository();

export const getProjectTasksUseCase = new GetProjectTasksUseCase(taskRepository);
export const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(taskRepository);
export const createTaskUseCase = new CreateTaskUseCase(taskRepository);
