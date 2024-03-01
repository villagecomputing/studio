import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ENUM_Ground_truth_status } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckedState } from '@radix-ui/react-checkbox';
import { CustomCellRendererProps } from 'ag-grid-react';
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
    <span className={cn(['flex items-center justify-between'])}>
      <span
        className={cn([
          'flex-shrink overflow-hidden text-ellipsis whitespace-nowrap',
          isPinnedBottomRow && 'text-slateGray700',
        ])}
      >
        {isPinnedBottomRow
          ? `${props.context.getNumberOfApprovedGT()} / ${props.context.rows.length} Approved`
          : cellContent}
      </span>
      {isPinnedBottomRow ? (
        <Button
          className="flex-shrink-0"
          onClick={props.context.toggleViewMode}
        >
          {isEditMode ? 'Done' : 'Edit'}
        </Button>
      ) : (
        isEditMode && (
          <Checkbox
            className="h-6 w-6  rounded-lg data-[state=checked]:cursor-default data-[state=checked]:border-green550 data-[state=unchecked]:border-borderActive data-[state=checked]:bg-green550 data-[state=unchecked]:bg-white"
            defaultChecked={isApproved}
            onClick={(event) => {
              const target = event.target as HTMLInputElement;
              // Prevent the Checkbox from being unchecked after it has been checked
              if (target.getAttribute('data-state') === 'checked') {
                event.preventDefault();
              }
            }}
            onCheckedChange={(checked: CheckedState) => {
              if (!props.value) {
                throw new Error('Cell data is missing');
              }
              // trigger onCellValueChanged where we do the db update and column refresh
              props.setValue?.({
                ...props.value,
                status: checked
                  ? ENUM_Ground_truth_status.APPROVED
                  : ENUM_Ground_truth_status.PENDING,
              });
            }}
          />
        )
      )}
    </span>
  );
};

export default GroundTruthCellRenderer;
