import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectRepository } from "src/repositories/project.repository";

// Mock the @repo/database module to avoid DB connections
/* 
create
findById
findByTitle
findAll
findProjectByUserId
edit
*/
const mockFindMany = vi.fn();
const mockFindUnique = vi.fn();
const mockCreate = vi.fn()

vi.mock('@repo/database', () => {
    return {
        getPrisma: vi.fn().mockReturnValue({
            project: {
                findUnique: mockFindUnique,
                findMany: mockFindMany,
                create: mockFindMany
            }
        })
    }
})

describe('ProjecRepository -- findAll', () => {
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