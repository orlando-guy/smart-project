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

    getMembers(
        projectId: string
    ): Promise<{ id: string; name: string; email: string }[]>

    addMember(
        projectId: string,
        memberId: string
    ): Promise<void>

    create(
        payload: CreateProjectDto
    ): Promise<Omit<Project, 'lead'>>

    update(
        id: string,
        payload: CreateProjectDto
    ): Promise<Project>

    delete(id: string): Promise<void>
}