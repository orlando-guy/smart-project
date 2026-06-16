import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { GetProjectTasksUseCase } from "../domain/usecases/GetProjectTasksUseCase";
import { UpdateTaskStatusUseCase } from "../domain/usecases/UpdateTaskStatusUseCase";
import { CreateTaskUseCase } from "../domain/usecases/CreateTaskUseCase";
import { UpdateTaskUseCase } from "../domain/usecases/UpdateTaskUseCase";
import { DeleteTaskUseCase } from "../domain/usecases/DeleteTaskUseCase";

const taskRepository = new TaskRepository();

export const getProjectTasksUseCase = new GetProjectTasksUseCase(taskRepository);
export const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(taskRepository);
export const createTaskUseCase = new CreateTaskUseCase(taskRepository);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
export const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
