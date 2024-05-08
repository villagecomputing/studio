import { Checkbox } from '@/components/ui/checkbox';
import { Enum_Dynamic_logs_static_fields } from '@/lib/services/ApiUtils/logs/utils';
import { CheckedState } from '@radix-ui/react-checkbox';
import { CustomHeaderProps } from 'ag-grid-react';
import { compact } from 'lodash';
import { useGridOperations } from '../hooks/useGridOperations';
import { LogsRow, LogsTableContext } from '../types';

const CheckboxHeaderCellRenderer = (
  props: CustomHeaderProps<LogsRow, LogsTableContext>,
) => {
  const { doesExternalFilterPass } = useGridOperations();

  const selectableRows = props.context.rows.filter(
    (row) =>
      row[Enum_Dynamic_logs_static_fields.DATASET_ROW_ID] == null &&
      doesExternalFilterPass(row, props.context.dateRange),
  );
  const allSelected = !selectableRows.some(
    (row) => row[Enum_Dynamic_logs_static_fields.CHECKBOX_SELECTION] === false,
  );

  return (
    <Checkbox
      className="rounded-[2px] border data-[state=unchecked]:border-2 data-[state=unchecked]:border-checkboxBorder data-[state=unchecked]:bg-white "
      checked={allSelected}
      disabled={!selectableRows.length}
      onCheckedChange={(checked: CheckedState) => {
        props.context.setRowIdsToCopyToDataset(
          compact(
            selectableRows.map((row) => {
              row[Enum_Dynamic_logs_static_fields.CHECKBOX_SELECTION] = checked;
              return checked ? String(row.id) : null;
            }),
          ),
        );
      }}
    />
  );
};

export default CheckboxHeaderCellRenderer;
