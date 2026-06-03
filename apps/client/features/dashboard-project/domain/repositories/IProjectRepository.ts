import { Project } from '../entities/Project';
import { QueryBuilder } from '../query/QueryBuilder';
import { ProjectInput as CreateProjectDto } from '@repo/shared';

export interface IProjectRepository {
    getProjects(
        query?: QueryBuilder
    ): Promise<Project[]>

    getSingleProject(
        projectId: string
    ): Promise<Project>

    create(
        payload: CreateProjectDto
    ): Promise<Omit<Project, 'lead'>>

    delete(id: string): Promise<void>
}