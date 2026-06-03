
import { describe, it, expect, vi } from 'vitest';
import { GetProjectUseCase } from '@/features/dashboard-project/domain/usecases/GetProjectUseCase';
import { IProjectRepository } from '@/features/dashboard-project/domain/repositories/IProjectRepository';

describe('GetProjectUseCase', () => {
    it('should call the repository to fetch projects', async () => {
        // 1. Mock the Repository (Contract)
        const mockRepository: IProjectRepository = {
            getProjects: vi.fn().mockResolvedValue([{
                id: '1',
                titre: 'Test Project'
            }]),
            create: vi.fn(),
            delete: vi.fn(),
        };

        const useCase = new GetProjectUseCase(mockRepository);

        // 2. Execute
        const result = await useCase.execute();

        // 3. Assert

        expect(mockRepository.getProjects).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{
            id: '1',
            titre: 'Test Project'
        }]);
    });
});