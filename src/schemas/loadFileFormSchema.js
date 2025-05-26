import { z } from 'zod';

export const loadFileFormSchema = z.object({
  report: z.instanceof(File, { message: 'A file is required' }),
});

