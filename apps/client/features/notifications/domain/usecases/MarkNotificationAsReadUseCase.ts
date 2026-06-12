import { INotificationRepository } from "../repositories/INotificationRepository";

export class MarkNotificationAsReadUseCase {
  constructor(private readonly repository: INotificationRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.markAsRead(id);
  }
}
