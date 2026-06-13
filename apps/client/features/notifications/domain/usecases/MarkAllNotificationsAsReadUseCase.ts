import { INotificationRepository } from "../repositories/INotificationRepository";

export class MarkAllNotificationsAsReadUseCase {
    constructor(private readonly repository: INotificationRepository) { }

    async execute(): Promise<void> {
        return this.repository.markAllAsRead();

    }

}