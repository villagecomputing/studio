import { CustomCellRendererProps } from 'ag-grid-react';
import { DatasetTableContext } from '../types';

const PredictiveLabelCellRenderer = (
  props: CustomCellRendererProps<unknown, string, DatasetTableContext>,
) => {
  const result = props.colDef?.field
    ? props.context.calculateMatchPercentage(props.colDef?.field)
    : 0;
  return <span>{`${result}%`}</span>;
};

export default PredictiveLabelCellRenderer;
