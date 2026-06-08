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
        const project = result.data;

        return new Project(
            project.id,
            project.titre,
            project.description,
            project.leadId ?? null,
            project.createdAt,
            project.lead,
            project.teams ?? [],
            project.tasks ?? []
        );
    }

    async create(payload: ProjectInput): Promise<Omit<Project, "lead">> {
        const result = await api.post<{ data: Project }>('/projects', {
            ...payload,
            description: payload.description ?? "",
        });
        const project = result.data.data;

        return new Project(
            project.id,
            project.titre,
            project.description,
            project.leadId,
            project.createdAt
        )
    }

    async update(id: string, payload: ProjectInput): Promise<Project> {
        const result = await api.put<{ data: Project }>(`/project/${id}`, {
            ...payload,
            description: payload.description ?? "",
        });
        const project = result.data.data;

        return new Project(
            project.id,
            project.titre,
            project.description,
            project.leadId,
            project.createdAt,
            project.lead,
            project.teams ?? [],
            project.tasks ?? []
        )
    }

    async delete(id: string): Promise<void> {
        await api.delete(`/project/${id}`);
    }

    async inviteMember(projectId: string, userId: string): Promise<void> {
        await api.post(`/project/${projectId}/members`, { userId });
    }
}
