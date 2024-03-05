import { CustomCellRendererProps } from 'ag-grid-react';
import { DatasetTableContext, DatasetTableViewModeEnum } from '../types';

const PredictiveLabelCellRenderer = (
  props: CustomCellRendererProps<unknown, string, DatasetTableContext>,
) => {
  const isEditMode =
    props.context.tableViewMode === DatasetTableViewModeEnum.EDIT;
  const value = props.value ? `${props.value}%` : '-';
  return <span>{isEditMode ? '' : value}</span>;
};

export default PredictiveLabelCellRenderer;
