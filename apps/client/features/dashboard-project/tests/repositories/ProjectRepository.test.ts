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

    it('should normalize the API response when creating a project', async () => {
        const mockApiResponse = {
            data: {
                success: true,
                data: {
                    id: 'new-id',
                    titre: 'New Project',
                    description: 'New Desc',
                    leadId: 'u2',
                    createdAt: new Date()
                }
            }
        };
        (api.post as any).mockResolvedValue(mockApiResponse);

        const repo = new ProjectRepository();
        const project = await repo.create({ title: 'New Project', description: 'New Desc' });

        expect(api.post).toHaveBeenCalledWith('/project/register', expect.anything());
        expect(project.id).toBe('new-id');
        expect(project.titre).toBe('New Project');
    });
});