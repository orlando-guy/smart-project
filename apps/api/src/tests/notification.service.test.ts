import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotificationService } from '../services/notification.service'
import { NotificationRepository } from '../repositories/notification.repository'
import { NotificationType } from '@repo/shared'

vi.mock('../repositories/notification.repository')

describe('NotificationService', () => {
    let notificationService: NotificationService;
    let mockNotificationRepo: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockNotificationRepo = NotificationRepository.prototype;
        notificationService = new NotificationService();
    });

    it('should create a notification successfully', async () => {
        const notifData = {
            type: NotificationType.PROJECT_CREATED,
            message: 'Project Alpha created',
            targetedUserId: 'user-123'
        };

        vi.mocked(mockNotificationRepo.create).mockResolvedValue({ id: 'notif-1', ...notifData, isRead: false, createdAt: new Date() });

        const result = await notificationService.notify(notifData as any);

        expect(result.id).toBe('notif-1');
        expect(mockNotificationRepo.create).toHaveBeenCalledWith(notifData);
    });

    it('should fetch user notifications', async () => {
        const userId = 'user-123';
        const mockNotifs = [
            { id: '1', message: 'Notif 1', targetedUserId: userId },
            { id: '2', message: 'Notif 2', targetedUserId: userId }
        ];

        vi.mocked(mockNotificationRepo.findByUserId).mockResolvedValue(mockNotifs);

        const result = await notificationService.getUserNotifications(userId);

        expect(result).toHaveLength(2);
        expect(mockNotificationRepo.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should mark a notification as read', async () => {
        const notifId = 'notif-1';
        vi.mocked(mockNotificationRepo.markAsRead).mockResolvedValue({ id: notifId, isRead: true });

        await notificationService.markAsRead(notifId);

        expect(mockNotificationRepo.markAsRead).toHaveBeenCalledWith(notifId);
    });

    it('should mark all notifications as read for a user', async () => {
        const userId = 'user-123';
        vi.mocked(mockNotificationRepo.markAllAsRead).mockResolvedValue({ count: 5 } as any);

        await notificationService.markAllAsRead(userId);

        expect(mockNotificationRepo.markAllAsRead).toHaveBeenCalledWith(userId);
    });

    describe('Utility Helpers', () => {
        it('should trigger task assigned notification', async () => {
            const userId = 'uid';
            const taskTitle = 'Test Task';
            
            vi.mocked(mockNotificationRepo.create).mockResolvedValue({} as any);

            await notificationService.notifyTaskAssigned(userId, taskTitle);

            expect(mockNotificationRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                type: NotificationType.TASK_ASSIGNED,
                message: expect.stringContaining(taskTitle),
                targetedUserId: userId
            }));
        });

        it('should trigger project created notification', async () => {
            const userId = 'uid';
            const projectTitle = 'Alpha';
            
            vi.mocked(mockNotificationRepo.create).mockResolvedValue({} as any);

            await notificationService.notifyProjectCreated(userId, projectTitle);

            expect(mockNotificationRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                type: NotificationType.PROJECT_CREATED,
                message: expect.stringContaining(projectTitle)
            }));
        });
    });
});
