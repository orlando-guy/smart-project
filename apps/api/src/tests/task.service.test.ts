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

    describe('createTask', () => {
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
                statut: "NOT_STARTED",
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
                statut: "NOT_STARTED",
                priority: ProjectPriority.MUST
            });
            await expect(call).rejects.toThrow("Le projet n'existe pas");
        });
    });

    describe('deleteTask', () => {
        it('should delete a task successfully if user is lead', async () => {
            const taskId = 'tid';
            const userId = 'lead_id';

            vi.mocked(mockTaskRepo.findById).mockResolvedValue({
                id: taskId,
                assignedUserId: 'other_id',
                project: { leadId: userId }
            });
            vi.mocked(mockTaskRepo.delete).mockResolvedValue({ id: taskId });

            const result = await taskService.deleteTask(taskId, userId);

            expect(result!.success).toBe(true);
            expect(mockTaskRepo.delete).toHaveBeenCalledWith(taskId);
        });

        it('should delete a task successfully if user is assigned', async () => {
            const taskId = 'tid';
            const userId = 'assigned_id';

            vi.mocked(mockTaskRepo.findById).mockResolvedValue({
                id: taskId,
                assignedUserId: userId,
                project: { leadId: 'lead_id' }
            });
            vi.mocked(mockTaskRepo.delete).mockResolvedValue({ id: taskId });

            const result = await taskService.deleteTask(taskId, userId);

            expect(result!.success).toBe(true);
            expect(mockTaskRepo.delete).toHaveBeenCalledWith(taskId);
        });

        it('should throw 403 if user is neither lead nor assigned', async () => {
            const taskId = 'tid';
            const userId = 'stranger_id';

            vi.mocked(mockTaskRepo.findById).mockResolvedValue({
                id: taskId,
                assignedUserId: 'assigned_id',
                project: { leadId: 'lead_id' }
            });

            const call = taskService.deleteTask(taskId, userId);
            await expect(call).rejects.toThrow("Vous n'avez pas la permission de supprimer cette tâche");
        });

        it('should throw 404 if task does not exist', async () => {
            vi.mocked(mockTaskRepo.findById).mockResolvedValue(null);

            const call = taskService.deleteTask('invalid', 'any');
            await expect(call).rejects.toThrow("La tâche que vous voulez supprimer n'existe pas");
        });
    });

    describe('updateTask', () => {
        it('should update a task successfully if user is lead', async () => {
            const taskId = 'tid';
            const userId = 'lead_id';
            const updateData = { title: 'Updated' };

            vi.mocked(mockTaskRepo.findById).mockResolvedValue({
                id: taskId,
                projectId: 'pid',
                assignedUserId: 'other_id',
                project: { leadId: userId }
            });
            vi.mocked(mockTaskRepo.update).mockResolvedValue({ id: taskId, ...updateData });

            const result = await taskService.updateTask(taskId, userId, updateData);

            expect(result!.title).toBe('Updated');
            expect(mockTaskRepo.update).toHaveBeenCalledWith(taskId, updateData);
        });

        it('should throw 403 if new assigned user is not member of project', async () => {
            const taskId = 'tid';
            const userId = 'lead_id';
            const updateData = { assignedUserId: 'new_uid' };

            vi.mocked(mockTaskRepo.findById).mockResolvedValue({
                id: taskId,
                projectId: 'pid',
                assignedUserId: 'old_uid',
                project: { leadId: userId }
            });
            vi.mocked(mockUserRepo.findById).mockResolvedValue({ id: 'new_uid' });
            vi.mocked(mockProjectRepo.isMember).mockResolvedValue(false);

            const call = taskService.updateTask(taskId, userId, updateData);
            await expect(call).rejects.toThrow("Le nouvel utilisateur assigné n'est pas membre de ce projet");
        });

        it('should throw 403 if user has no permission', async () => {
            const taskId = 'tid';
            const userId = 'stranger_id';

            vi.mocked(mockTaskRepo.findById).mockResolvedValue({
                id: taskId,
                projectId: 'pid',
                assignedUserId: 'assigned_id',
                project: { leadId: 'lead_id' }
            });

            const call = taskService.updateTask(taskId, userId, { title: 'Hacked' });
            await expect(call).rejects.toThrow("Vous n'avez pas la permission de modifier cette tâche");
        });
    });
});
