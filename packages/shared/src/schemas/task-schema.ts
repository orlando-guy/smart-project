import { z } from 'zod';
import { ProjectPriority, TaskStatus } from '../constants';

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  endDate: z.string().date().optional().nullable(),
  priority: z.nativeEnum(ProjectPriority),
  statut: z.nativeEnum(TaskStatus),
  projectId: z.string().uuid(),
  assignedUserIds: z.array(z.string().uuid()).min(1, "Au moins un utilisateur doit être assigné"),
});

export const UpdateTaskSchema = TaskSchema.partial().omit({ projectId: true });

export const ChangeTaskStatusSchema = z.object({
  statut: z.nativeEnum(TaskStatus)
});

export type TaskInput = z.infer<typeof TaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type ChangeTaskStatusInput = z.infer<typeof ChangeTaskStatusSchema>;