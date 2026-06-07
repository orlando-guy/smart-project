import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TaskService } from '../services/task.service'
import { TaskRepository } from '../repositories/task.repository'
import { ProjectRepository } from '../repositories/project.repository'
import { UserRepository } from '../repositories/user.repository'

vi.mock('../repositories/task.repository')
vi.mock('../repositories/project.repository')
vi.mock('../repositories/user.repository')

enum ProjectPriority {
    MUST = 'MUST',
    SHOULD = 'SHOULD',
    COULD = 'COULD',
    WONT = 'WONT'
}

enum TaskStatus {
    ACHIEVED = 'ACHIEVED',
    ONGOING = 'ONGOING',
    NOT_STARTED = 'NOT_STARTED'
}

describe('TaskService', () => {
    let taskService: TaskService;
    let mockTaskRepo: any;
    let mockProjectRepo: any;
    let mockUserRepo: any;

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockTaskRepo = TaskRepository.prototype;
        mockProjectRepo = ProjectRepository.prototype;
        mockUserRepo = UserRepository.prototype;

        taskService = new TaskService();
    });

    it('should create a task successfully', async () => {
        const taskData = {
            title: 'New Task',
            projectId: 'pid',
            assignedUserId: 'uid',
            priority: ProjectPriority.MUST,
            statut: TaskStatus.NOT_STARTED
        };

        vi.mocked(mockProjectRepo.findById).mockResolvedValue({ id: 'pid' });
        vi.mocked(mockUserRepo.findById).mockResolvedValue({ id: 'uid' });
        vi.mocked(mockProjectRepo.isMember).mockResolvedValue(true);
        vi.mocked(mockTaskRepo.create).mockResolvedValue({ id: 'tid', ...taskData });

        const result = await taskService.createTask(taskData);

        expect(result).toBeDefined();
        expect(mockTaskRepo.create).toHaveBeenCalledWith(taskData);
    });

    it('should throw 403 if user is not a member', async () => {
        vi.mocked(mockProjectRepo.findById).mockResolvedValue({ id: 'pid' });
        vi.mocked(mockUserRepo.findById).mockResolvedValue({ id: 'uid' });
        vi.mocked(mockProjectRepo.isMember).mockResolvedValue(false);

        const call = taskService.createTask({
            title: 'New Task',
            projectId: 'pid',
            assignedUserId: 'uid',
            priority: ProjectPriority.MUST
        });
        await expect(call).rejects.toThrow("L'utilisateur assigné n'est pas membre de ce projet");
    });

    it('should throw 404 if project does not exist', async () => {
        vi.mocked(mockProjectRepo.findById).mockResolvedValue(null);

        const call = taskService.createTask({
            title: 'New Task',
            projectId: 'invalid',
            assignedUserId: 'uid',
            priority: ProjectPriority.MUST
        });
        await expect(call).rejects.toThrow("Le projet n'existe pas");
    });
});
