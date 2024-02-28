import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ENUM_Ground_truth_status } from '@/lib/types';
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
  const cellContent = props.valueFormatted || props.value?.content;

  const isEditMode =
    props.context.getTableViewMode() === DatasetTableViewModeEnum.EDIT;
  const isPinnedBottomRow =
    props.node.isRowPinned() && props.node.rowPinned === 'bottom';

  return (
    <span className="flex items-center justify-between">
      <span className="min-w-20 flex-shrink overflow-hidden text-ellipsis whitespace-nowrap">
        {isPinnedBottomRow
          ? `${props.context.getNumberOfApprovedGT()} / ${props.context.rowData?.length} Approved`
          : cellContent}
      </span>
      {isPinnedBottomRow ? (
        <Button
          className="flex-shrink-0"
          onClick={() =>
            console.log(`on click ${isEditMode ? 'Done' : 'Edit'} button`)
          }
        >
          {isEditMode ? 'Done' : 'Edit'}
        </Button>
      ) : (
        isEditMode && (
          <Checkbox
            className="h-6 w-6 rounded-lg data-[state=checked]:border-green550 data-[state=unchecked]:border-borderActive data-[state=checked]:bg-green550 data-[state=unchecked]:bg-white"
            defaultChecked={
              props.value?.status === ENUM_Ground_truth_status.APPROVED
            }
            onCheckedChange={(checked: CheckedState) => {
              if (!props.value || !props.column) {
                throw new Error('Cell data is missing');
              }
              props.context.updateGroundTruthRowStatus(
                props.value?.id,
                checked,
              );
              props.node.setDataValue(props.column, {
                ...props.value,
                status: checked
                  ? ENUM_Ground_truth_status.APPROVED
                  : ENUM_Ground_truth_status.PENDING,
              });
              props.api.refreshCells({
                columns: [props.column],
                force: true,
              });
            }}
          />
        )
      )}
    </span>
  );
};

export default GroundTruthCellRenderer;
