import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";
import { GetNotificationsUseCase } from "../domain/usecases/GetNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "../domain/usecases/MarkNotificationAsReadUseCase";
import { MarkAllNotificationsAsReadUseCase } from "../domain/usecases/MarkAllNotificationsAsReadUseCase";


const notificationRepository = new NotificationRepository();

export const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
export const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);
export const markAllNotificationsAsReadUseCase = new MarkAllNotificationsAsReadUseCase(notificationRepository);
