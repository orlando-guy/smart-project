import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProjectService } from '../services/project.service'
import { ProjectRepository } from '../repositories/project.repository'
import { UserRepository } from '../repositories/user.repository'

vi.mock('../repositories/project.repository')
vi.mock('../repositories/user.repository')
vi.mock('../services/notification.service')

describe('ProjectService -- Add Member', () => {
    let projectService: ProjectService;
    let mockProjectRepo: any;
    let mockUserRepo: any;

    beforeEach(() => {
        vi.clearAllMocks();
        
        // When we use vi.mock without a factory, it automatically mocks all methods.
        // We can access the prototype to define behavior for all instances.
        mockProjectRepo = ProjectRepository.prototype;
        mockUserRepo = UserRepository.prototype;

        projectService = new ProjectService();
    });

    it('should add a member successfully', async () => {
        const authorId = 'lead_id';
        const projectId = 'project_id';
        const memberId = 'member_id';

        vi.mocked(mockProjectRepo.findById).mockResolvedValue({ id: projectId, leadId: authorId });
        vi.mocked(mockUserRepo.findById).mockResolvedValue({ id: memberId });
        vi.mocked(mockProjectRepo.isMember).mockResolvedValue(false);
        vi.mocked(mockProjectRepo.addMemberToAProject).mockResolvedValue({ projectId, userId: memberId });

        const result = await projectService.addMemberToProject(authorId, projectId, memberId);

        expect(result).toEqual({ projectId, userId: memberId });
        expect(mockProjectRepo.addMemberToAProject).toHaveBeenCalledWith(projectId, memberId);
    });

    it('should throw 404 if project does not exist', async () => {
        vi.mocked(mockProjectRepo.findById).mockResolvedValue(null);

        const call = projectService.addMemberToProject('any', 'invalid', 'any');
        await expect(call).rejects.toThrow('Le projet auquel vous voulez-y ajouter un membre n\'existe pas');
    });

    it('should throw 403 if requester is not the lead', async () => {
        vi.mocked(mockProjectRepo.findById).mockResolvedValue({ id: 'pid', leadId: 'actual_lead' });

        const call = projectService.addMemberToProject('not_lead', 'pid', 'any');
        await expect(call).rejects.toThrow('Seul le responsable du projet peut ajouter des membres');
    });

    it('should throw 404 if user to add does not exist', async () => {
        vi.mocked(mockProjectRepo.findById).mockResolvedValue({ id: 'pid', leadId: 'lead' });
        vi.mocked(mockUserRepo.findById).mockResolvedValue(null);

        const call = projectService.addMemberToProject('lead', 'pid', 'invalid_user');
        await expect(call).rejects.toThrow('L\'utilisateur n\'existe pas');
    });

    it('should throw 409 if user is already a member', async () => {
        vi.mocked(mockProjectRepo.findById).mockResolvedValue({ id: 'pid', leadId: 'lead' });
        vi.mocked(mockUserRepo.findById).mockResolvedValue({ id: 'uid' });
        vi.mocked(mockProjectRepo.isMember).mockResolvedValue(true);

        const call = projectService.addMemberToProject('lead', 'pid', 'uid');
        await expect(call).rejects.toThrow('Cet utilisateur est déjà membre du projet');
    });
});
