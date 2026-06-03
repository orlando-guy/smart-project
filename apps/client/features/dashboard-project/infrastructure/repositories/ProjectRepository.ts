import { api } from "@/lib/api";
import { Project } from "../../domain/entities/Project";
import { QueryBuilder } from "../../domain/query/QueryBuilder";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectInput } from "@repo/shared";

export class ProjectRepository
    implements IProjectRepository
{
    async getProjects(query?: QueryBuilder): Promise<Project[]> {
        const qs = query?.build();
        const endpoint = qs ? `/projects?${qs}` : "/projects";

        const response = await api.get(endpoint);
        return response.data.data.map((item: Project) => new Project(
            item.id,
            item.titre,
            item.description,
            item.leadId,
            item.createdAt,
            item.lead
        ))
    }

    async getSingleProject(projectId: string): Promise<Project> {
        const { data: result } = await api.get(`/project/${projectId}`);

        return new Project(
            result.data.id,
            result.data.titre,
            result.data.description,
            result.data.leadId,
            result.data.createdAt,
            result.data.lead,
            result.data.teams,
            result.data.tasks
        );
    }

    async create(payload: ProjectInput): Promise<Omit<Project, "lead">> {
        const result = await api.post<Project>('/project/register', payload);
        return new Project(
            result.data.id,
            result.data.titre,
            result.data.description,
            result.data.leadId,
            result.data.createdAt
        )
    }

    async delete(id: string): Promise<void> {
        await api.delete(`/project/${id}`);
    }
}