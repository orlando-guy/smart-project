import { describe, it, expect, vi } from 'vitest';
import { ProjectRepository } from '@/features/dashboard-project/infrastructure/repositories/ProjectRepository';
import { api } from '@/lib/api';

// Mock the axios instance
vi.mock('@/lib/api');

describe('ProjectRepository', () => {
    it('should fetch and map projects correctly', async () => {
        const mockApiResponse = {
            data: {
                data: [
                    {
                        id: '1',
                        titre: 'API Project',
                        description: 'Desc',
                        leadId: 'u1',
                        createdAt: new Date()
                    }
                ]
            }
        };
        (api.get as any).mockResolvedValue(mockApiResponse);

        const repo = new ProjectRepository();
        const projects = await repo.getProjects();


        expect(api.get).toHaveBeenCalledWith('/projects');
        expect(projects[0].titre).toBe('API Project');
        expect(projects[0].constructor.name).toBe('Project');
    });
});