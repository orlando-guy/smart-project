import { z } from 'zod';
import { ProjectPriority, TaskStatus } from '../constants';

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  endDate: z.string().datetime().optional().nullable(),
  priority: z.nativeEnum(ProjectPriority).optional().default(ProjectPriority.COULD),
  statut: z.nativeEnum(TaskStatus).optional().default(TaskStatus.NOT_STARTED),
  projectId: z.string().uuid(),
  assignedUserId: z.string().uuid(),
});

export type TaskInput = z.infer<typeof TaskSchema>;