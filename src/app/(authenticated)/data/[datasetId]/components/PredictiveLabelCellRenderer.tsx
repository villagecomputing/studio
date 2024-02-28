import { CustomCellRendererProps } from 'ag-grid-react';

const PredictiveLabelCellRenderer = (props: CustomCellRendererProps) => {
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;

  // const isPinnedBottomRow =
  //   props.node.isRowPinned() && props.node.rowPinned === 'bottom';

  return <span>{cellValue}</span>;
};

export default PredictiveLabelCellRenderer;
