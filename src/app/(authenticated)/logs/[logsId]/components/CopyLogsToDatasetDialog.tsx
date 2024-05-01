import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type CopyLogsToDatasetDialogProps = {
  open: boolean;
  onCancel: () => void;
  onAction: (datasetTitle: string) => Promise<void>;
};
const formSchema = z.object({
  datasetTitle: z
    .string()
    .min(1, {
      message:
        'Please provide a title for the dataset, the field cannot be left empty.',
    })
    .max(50, { message: 'The title cannot be longer than 50 characters.' }),
});

const CopyLogsToDatasetDialog: React.FC<CopyLogsToDatasetDialogProps> = ({
  open,
  onCancel,
  onAction,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      datasetTitle: '',
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onAction(values.datasetTitle);
    closeDialog();
  };
  const closeDialog = () => {
    form.reset();
    onCancel();
  };
  return (
    <Dialog
      defaultOpen={false}
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeDialog();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy logs to new dataset</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="datasetTitle"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Dataset Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter className="pt-8">
              <Button type="button" variant={'outline'} onClick={closeDialog}>
                {'Cancel'}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {'Copy'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CopyLogsToDatasetDialog;
