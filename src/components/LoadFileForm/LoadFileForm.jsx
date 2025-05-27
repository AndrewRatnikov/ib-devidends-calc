import { loadFileFormSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ofx } from 'ofx-data-extractor';
import { useForm } from 'react-hook-form';

import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

export default function LoadFileForm() {
  const form = useForm({
    resolver: zodResolver(loadFileFormSchema),
  });

  const fileRef = form.register('report');

  const onSubmit = (data) => {
    Ofx.fromBlob(data.report[0])
      .then((data) => data.toJson())
      .then((ofx) => console.log(ofx));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="report"
          render={() => (
            <FormItem>
              <FormLabel>Report</FormLabel>

              <FormControl>
                <Input type="file" {...fileRef} />
              </FormControl>
              <FormMessage />

              <FormDescription>
                Please load your report in ofx format
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit">Load</Button>
      </form>
    </Form>
  );
}
