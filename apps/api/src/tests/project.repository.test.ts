import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectRepository } from "src/repositories/project.repository";

const { mockFindMany, mockFindUnique, mockCreate } = vi.hoisted(() => ({
    mockFindMany: vi.fn(),
    mockFindUnique: vi.fn(),
    mockCreate: vi.fn()
}));

vi.mock('@repo/database', () => {
    return {
        getPrisma: vi.fn().mockReturnValue({
            project: {
                findUnique: mockFindUnique,
                findMany: mockFindMany,
                create: mockCreate
            }
        })
    }
})

describe('ProjectRepository -- findAll', () => {
    let projectRepository: ProjectRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        projectRepository = new ProjectRepository();
    });

    it('devrais appeler prisma.project.findMany', async () => {
        // GIVEN
        mockFindMany.mockResolvedValue([]);

        // WHEN
        await projectRepository.findAll();

        // THEN
        expect(mockFindMany).toHaveBeenCalledTimes(1)
    })
})
