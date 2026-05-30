import { getPrisma } from "@repo/database";
import { ProjectInput as ProjectInputType } from "@repo/shared";
import { string } from "zod";

type ProjectInputWithLead = ProjectInputType & {
    authorId: string;
}

export class ProjectRepository {
    readonly #prisma = getPrisma();

    // Créer un projet
    async create(projectData: ProjectInputWithLead) {
        return this.#prisma.project.create({
            data: {
                titre: projectData.title,
                description: projectData.description,
                leadId: projectData.authorId
            }
        })
    }

    // Trouver un projet par son ID
    async findById(id: string) {
        return this.#prisma.project.findUnique({
            select: {
                id: true,
                titre: true,
                description: true,
                createdAt: true,
                tasks: {
                    select: {
                        title: true,
                        statut: true,
                        description: true,
                        priority: true,
                        endDate: true,
                        // TODO Also include comment when it will be ready
                        assignedUser: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                teams: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            where: {id}
        })
    }

    // Trouver un projet par son titre
    async findByTitle(tilte: string) {
        return this.#prisma.project.findUnique({
            where: {titre: tilte}
        })
    }

    // Récupérer la liste des projet
    async findAll() {
        return this.#prisma.project.findMany({
            orderBy: {createdAt: "desc"}
        })
    }

    // Récupérer la liste des projets d'un utilisateur
    async findProjectByUserId(userId: string) {
        return this.#prisma.project.findMany({
            where: {
                leadId: userId
            }
        })
    }

    // Modification du projet
    async edit(id: string, data: ProjectInputType) {
        return this.#prisma.project.update({
            where: {id},
            data
        })
    }
}