import { CreateProjectUseCase } from "../domain/usecases/CreateProjectUseCase";
import { GetProjectUseCase } from "../domain/usecases/GetProjectUseCase";
import { DeleteProjectUseCase } from "../domain/usecases/DeleteProjectUseCase";
import { ProjectRepository } from "../infrastructure/repositories/ProjectRepository";
import { GetSingleProjectUseCase } from "../domain/usecases/GetSingleProjectUseCase";
import { UpdateProjectUseCase } from "../domain/usecases/UpdateProjectUseCase";
import { GetProjectMembersUseCase } from "../domain/usecases/GetProjectMembersUseCase";
import { AddMemberToProjectUseCase } from "../domain/usecases/AddMemberToProjectUseCase";

const projectRepository = new ProjectRepository();

export const getProjectUseCase = new GetProjectUseCase(projectRepository)
export const createProjectUseCase = new CreateProjectUseCase(projectRepository);
export const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);
export const getSingleProjectUseCase = new GetSingleProjectUseCase(projectRepository);
export const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
export const getProjectMembersUseCase = new GetProjectMembersUseCase(projectRepository);
export const addMemberToProjectUseCase = new AddMemberToProjectUseCase(projectRepository);
