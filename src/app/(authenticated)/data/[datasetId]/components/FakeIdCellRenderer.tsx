import { CustomCellRendererProps } from 'ag-grid-react';
import CopyIdToClipboardButton from './CopyIdToClipboardButton';

const FakeIdCellRenderer = (
  props: CustomCellRendererProps<unknown, string, unknown>,
) => {
  return (
    <div className="flex items-center justify-center">
      <CopyIdToClipboardButton id={props.value ?? ''} hideId />
    </div>
  );
};
export default FakeIdCellRenderer;
