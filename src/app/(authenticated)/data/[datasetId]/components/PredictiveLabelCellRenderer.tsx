import { CustomCellRendererProps } from 'ag-grid-react';
import { DatasetTableContext, DatasetTableViewModeEnum } from '../types';

const PredictiveLabelCellRenderer = (
  props: CustomCellRendererProps<unknown, string, DatasetTableContext>,
) => {
  const isEditMode =
    props.context.tableViewMode === DatasetTableViewModeEnum.EDIT;
  return <span>{isEditMode ? '' : props.value}</span>;
};

export default PredictiveLabelCellRenderer;
