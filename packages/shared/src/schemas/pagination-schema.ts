import { z } from 'zod';

export const PaginationSchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    p: z.coerce.number().int().positive().default(1),
    ord: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
