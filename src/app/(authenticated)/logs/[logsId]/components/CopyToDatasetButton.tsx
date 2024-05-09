import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { Dispatch, SetStateAction, useState } from 'react';
import CopyLogsToDatasetDialog from './CopyLogsToDatasetDialog';

type CopyToDatasetButtonProps = {
  rowIdsToCopyToDataset: string[];
  datasetUuid?: string;
  datasetName?: string;
  logsId: string;
  setRowIdsToCopyToDataset: Dispatch<SetStateAction<string[]>>;
};

const CopyToDatasetButton: React.FC<CopyToDatasetButtonProps> = ({
  rowIdsToCopyToDataset,
  setRowIdsToCopyToDataset,
  datasetName,
  datasetUuid,
  logsId,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const onClickCopyToDataset = () => {
    if (!rowIdsToCopyToDataset.length) {
      return;
    }
    if (!datasetUuid) {
      setDialogOpen(true);
      return;
    }

    copyToDataset(datasetName ?? '');
  };

  const copyToDataset = async (datasetTitle: string) => {
    const reqResponse = await fetch(`/api/logs/${logsId}/copyToDataset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        datasetName: datasetTitle,
        logRowIds: rowIdsToCopyToDataset,
      }),
    });
    if (reqResponse.status !== 200) {
      toast({
        value: `Failed to copy logs to ${datasetTitle} dataset`,
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Logs copied to dataset',
      description: `Successfully copied the logs to ${datasetTitle} dataset.`,
      variant: 'default',
    });
    setRowIdsToCopyToDataset([]);
  };
  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mx-4 mb-4 mt-2">
              <Button
                disabled={!rowIdsToCopyToDataset.length}
                variant={'outline'}
                onClick={onClickCopyToDataset}
              >
                {datasetUuid ? 'Update Dataset' : 'Copy to Dataset'}
              </Button>
            </div>
          </TooltipTrigger>
          {(datasetName || !rowIdsToCopyToDataset.length) && (
            <TooltipContent
              side="bottom"
              className="border border-border bg-paleBlueGrey text-xs text-secondary-foreground"
            >
              <p>
                {!rowIdsToCopyToDataset.length
                  ? 'No rows selected'
                  : `Copying to ${datasetName}`}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <CopyLogsToDatasetDialog
        open={dialogOpen}
        onCancel={() => {
          setDialogOpen(false);
        }}
        onAction={copyToDataset}
      />
    </>
  );
};

export default CopyToDatasetButton;
