import { loadFileFormSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';
import { Input } from '../ui/input';

export default function LoadFileForm() {
  const form = useForm({
    resolver: zodResolver(loadFileFormSchema),
    defaultValues: {
      report: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="report"
          render={(field) => (
            <FormItem>
              <FormLabel>Report</FormLabel>

              <FormControl>
                <Input placeholder="Load report" type="file" {...field} />
              </FormControl>

              <FormDescription>Input Description</FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit">Load</Button>
      </form>
    </Form>
  );
}
