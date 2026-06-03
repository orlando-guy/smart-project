import { z } from 'zod';
export * from './schemas/project-schema';
export * from './schemas/user-schema';

export const CourseSchema = z.object({
  id: z.number().nullish(),
  name: z.string().min(3, {
    message: "Name is required and should be minimum 3 character"
  }),
  description: z.string().min(20, {
    message: "Description is required and should be minimum 20 character"
  })
});

export type Course = z.infer<typeof CourseSchema>;