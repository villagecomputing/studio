import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ENUM_Ground_truth_status } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckedState } from '@radix-ui/react-checkbox';
import { CustomCellRendererProps } from 'ag-grid-react';
import { CheckIcon } from 'lucide-react';
import {
  DatasetTableContext,
  DatasetTableViewModeEnum,
  GroundTruthCell,
} from '../types';

const GroundTruthCellRenderer = (
  props: CustomCellRendererProps<unknown, GroundTruthCell, DatasetTableContext>,
) => {
  const isApproved = props.value?.status === ENUM_Ground_truth_status.APPROVED;
  const cellContent = props.valueFormatted || props.value?.content;

  const isEditMode =
    props.context.tableViewMode === DatasetTableViewModeEnum.EDIT;
  const isPinnedBottomRow =
    props.node.isRowPinned() && props.node.rowPinned === 'bottom';

  return (
    <span
      className={cn([
        'flex h-full justify-between',
        !isPinnedBottomRow ? 'items-center' : 'pt-1.5',
      ])}
    >
      <span
        className={cn([
          'flex-shrink self-start overflow-hidden text-ellipsis whitespace-nowrap',
          isPinnedBottomRow && 'text-slateGray700',
        ])}
      >
        {cellContent}
      </span>
      {isPinnedBottomRow && (
        <Button
          className="flex-shrink-0"
          onClick={props.context.toggleViewMode}
        >
          {isEditMode ? 'Done' : 'Edit'}
        </Button>
      )}
      {!isPinnedBottomRow &&
        (isEditMode ? (
          <Checkbox
            className="h-6 w-6 rounded-lg data-[state=checked]:border-green550 data-[state=unchecked]:border-borderActive data-[state=checked]:bg-green550 data-[state=unchecked]:bg-white"
            checked={isApproved}
            onCheckedChange={(checked: CheckedState) => {
              if (!props.value || props.node.rowIndex === null) {
                throw new Error('GT Cell data is missing');
              }
              props.context.updateGroundTruthCell({
                rowIndex: props.node.rowIndex,
                content: props.value.content,
                status: checked
                  ? ENUM_Ground_truth_status.APPROVED
                  : ENUM_Ground_truth_status.PENDING,
              });
            }}
          />
        ) : (
          isApproved && <CheckIcon className="h-6 w-6 text-green550" />
        ))}
    </span>
  );
};

export default GroundTruthCellRenderer;
