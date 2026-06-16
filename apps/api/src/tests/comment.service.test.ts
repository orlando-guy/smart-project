import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CommentService } from '../services/comment.service'
import { CommentRepository } from '../repositories/comment.repository'
import { TaskRepository } from '../repositories/task.repository'
import { ProjectRepository } from '../repositories/project.repository'

vi.mock('../repositories/comment.repository')
vi.mock('../repositories/task.repository')
vi.mock('../repositories/project.repository')

describe('CommentService', () => {
    let commentService: CommentService;
    let mockCommentRepo: any;
    let mockTaskRepo: any;
    let mockProjectRepo: any;

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockCommentRepo = CommentRepository.prototype;
        mockTaskRepo = TaskRepository.prototype;
        mockProjectRepo = ProjectRepository.prototype;

        commentService = new CommentService();
    });

    describe('createComment', () => {
        it('should create a comment successfully if user is a member', async () => {
            const taskId = 'task_id';
            const authorId = 'user_id';
            const commentData = { description: 'Great work!' };

            vi.mocked(mockTaskRepo.findById).mockResolvedValue({ id: taskId, projectId: 'pid' });
            vi.mocked(mockProjectRepo.isMember).mockResolvedValue(true);
            vi.mocked(mockCommentRepo.create).mockResolvedValue({ id: 'cid', ...commentData, taskId, authorId });

            const result = await commentService.createComment(taskId, authorId, commentData);

            expect(result).toBeDefined();
            expect(mockCommentRepo.create).toHaveBeenCalledWith(taskId, authorId, commentData);
        });

        it('should throw 404 if the task does not exist', async () => {
            vi.mocked(mockTaskRepo.findById).mockResolvedValue(null);

            const call = commentService.createComment('invalid_task', 'user_id', { description: 'test' });
            await expect(call).rejects.toThrow('La tâche n\'existe pas');
        });

        it('should throw 403 if user is not a member of the project', async () => {
            const taskId = 'task_id';
            const authorId = 'non_member_id';

            vi.mocked(mockTaskRepo.findById).mockResolvedValue({ id: taskId, projectId: 'pid' });
            vi.mocked(mockProjectRepo.isMember).mockResolvedValue(false);

            const call = commentService.createComment(taskId, authorId, { description: 'test' });
            await expect(call).rejects.toThrow('Vous n\'êtes pas membre de ce projet');
        });
    });
});
