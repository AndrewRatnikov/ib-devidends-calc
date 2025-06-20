import { loadFileFormSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { convertOfxToJson, extractDividendsFromJson } from '../../lib/helpers';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
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
    const file = data.report[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const ofxContent = e.target.result;

        try {
          const ofxJson = convertOfxToJson(ofxContent);
          const dividends = extractDividendsFromJson(ofxJson);
          console.log('Extracted Dividends: ', dividends);
        } catch (error) {
          console.error('Error processing OFX file:', error);
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="report"
              render={() => (
                <FormItem>
                  <FormLabel>Report</FormLabel>

                  <FormControl>
                    <Input type="file" {...fileRef} accept=".ofx" />
                  </FormControl>
                  <FormMessage />

                  <FormDescription>
                    Please load your report in ofx format
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4">
              Load
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
