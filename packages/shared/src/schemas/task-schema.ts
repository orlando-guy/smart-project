import { z } from 'zod';
import { ProjectPriority, TaskStatus } from '../constants';

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  endDate: z.string().datetime().optional().nullable(),
  priority: z.nativeEnum(ProjectPriority).default(ProjectPriority.COULD),
  statut: z.nativeEnum(TaskStatus).default(TaskStatus.NOT_STARTED),
  projectId: z.string().uuid(),
  assignedUserId: z.string().uuid(),
});

export const UpdateTaskSchema = TaskSchema.partial().omit({ projectId: true });

export const ChangeTaskStatusSchema = z.object({
  statut: z.nativeEnum(TaskStatus)
});

export type TaskInput = z.infer<typeof TaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type ChangeTaskStatusInput = z.infer<typeof ChangeTaskStatusSchema>;