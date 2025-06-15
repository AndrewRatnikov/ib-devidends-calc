import { loadFileFormSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ofx } from 'ofx-data-extractor';
import { useForm } from 'react-hook-form';

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
    Ofx.fromBlob(data.report[0])
      .then((data) => data.toJson())
      .then((ofxResponse) => {
        console.log(ofxResponse);

        // const ofx = new Ofx(ofxResponse);

        // const bankTransferList = ofx.getBankTransferList();
        // console.log(bankTransferList);
      });
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
                    <Input type="file" {...fileRef} />
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
