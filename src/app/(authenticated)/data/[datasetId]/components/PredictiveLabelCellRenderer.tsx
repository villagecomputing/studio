import { CustomCellRendererProps } from 'ag-grid-react';
import { DatasetTableContext, DatasetTableViewModeEnum } from '../types';

const PredictiveLabelCellRenderer = (
  props: CustomCellRendererProps<unknown, string, DatasetTableContext>,
) => {
  const isEditMode =
    props.context.tableViewMode === DatasetTableViewModeEnum.EDIT;
  const values = props.value?.split('|');
  const cellContent =
    values?.length === 2 ? (
      <>
        <b>{values[0]}</b>
        <i>{values[1]}</i>
      </>
    ) : (
      values?.[0] || '-'
    );
  return (
    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
      {isEditMode ? '' : cellContent}
    </span>
  );
};

export default PredictiveLabelCellRenderer;
