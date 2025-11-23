import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { Card, CardContent } from '@/components/ui/card';
import { convertOfxToJson, extractDividendsFromJson } from '@/lib/helpers';
import { loadFileFormSchema } from '@/schemas';
import { useDividendsStore } from '@/store/useDividendsStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
  const setFileData = useDividendsStore((s) => s.setFileData);
  const clearFileData = useDividendsStore((s) => s.clearFileData);

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
          setFileData(dividends);
          toast.success('File loaded successfully');
        } catch (error) {
          console.error('Error processing OFX file:', error);
          toast.error(
            'Failed to process OFX file. Please check the file format.',
          );
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast.error('Failed to read file');
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    form.reset();
    clearFileData();
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

            <ButtonGroup className="mt-4">
              <Button type="submit">Load</Button>
              <ButtonGroupSeparator />
              <Button type="button" onClick={handleClear}>
                Clear
              </Button>
            </ButtonGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
