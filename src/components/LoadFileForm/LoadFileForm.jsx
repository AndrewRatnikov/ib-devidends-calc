import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { convertOfxToJson, extractDividendsFromJson } from '@/lib/helpers';
import { loadFileFormSchema } from '@/schemas';
import { useDividendsStore } from '@/store/useDividendsStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadIcon } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function LoadFileForm() {
  const [open, setOpen] = React.useState(false);
  const fileData = useDividendsStore((s) => s.fileData);
  const fileMetadata = useDividendsStore((s) => s.fileMetadata);
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
          const metadata = {
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
          };
          setFileData(dividends, metadata);
          toast.success('File loaded successfully');
          setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          {fileData ? 'Edit' : 'Load report'} <UploadIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Load Report</DialogTitle>
          <DialogDescription>
            Upload your dividend report in OFX format to visualize your tax
            data.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    {fileMetadata ? (
                      <span className="text-sm">
                        Currently loaded: <strong>{fileMetadata.name}</strong>
                      </span>
                    ) : (
                      'Please load your report in ofx format'
                    )}
                  </FormDescription>
                </FormItem>
              )}
            />

            <ButtonGroup>
              <Button type="submit">Load</Button>
              <ButtonGroupSeparator />
              <Button type="button" onClick={handleClear}>
                Clear
              </Button>
            </ButtonGroup>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
