import { Project } from "@repo/database";
import { ProjectInput } from "@repo/shared";
import { generateErrorWithStatusCode } from "src/lib/utils";
import { ProjectRepository } from "src/repositories/project.repository";

export class ProjectService {
    private readonly projectRepository = new ProjectRepository()

    async createProject(authorId: string, projectData: ProjectInput): Promise<Project> {
        const { title } = projectData;
        const existingProject = await this.projectRepository.findByTitle(title)

        if (existingProject) {
            const error = new Error("Le projet que vous éssayer de créer existe déjà");
            (error as any).statusCode = 400;
            throw error
        }

        try {
            const project = await this.projectRepository.create({
                ...projectData,
                authorId
            })

            return project;
        } catch (error) {
            const duplicateError = new Error("Impossible de créer le projet. Une érreur est survenue.");
            (duplicateError as any).statusCode = 500;
            console.error(error);
            throw duplicateError;
        }
    }
    
    async listUserProject(userId: string): Promise<Project[]> {
        const projects = await this.projectRepository.findProjectByUserId(userId);
        return projects;
    }

    async fetchProjectDetail(projectId: string) {
        try {
            const projectDetail = await this.projectRepository.findById(projectId);
            return projectDetail;
        } catch(error) {
            generateErrorWithStatusCode(
                'Impossible de recupére les données demandés. Une érreur est survenue.',
                500,
                error
            );
        }
    }
}