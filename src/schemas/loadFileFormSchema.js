import { z } from 'zod';

export const loadFileFormSchema = z.object({
  report: z.instanceof(FileList, { message: 'A file is required' }),
});
