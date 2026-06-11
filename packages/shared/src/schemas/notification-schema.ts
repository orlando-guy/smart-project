import { z } from 'zod';
import { NotificationType } from '../constants';

export const NotificationSchema = z.object({
  type: z.nativeEnum(NotificationType),
  message: z.string().min(1),
  targetedUserId: z.string().uuid(),
});

export type NotificationInput = z.infer<typeof NotificationSchema>;
