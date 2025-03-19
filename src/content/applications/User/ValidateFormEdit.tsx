import { z } from 'zod';

export const validateSchema = z.object({
  name: z.string().min(1, 'Name is required')
});

export type ValidateInput = z.infer<typeof validateSchema>; 