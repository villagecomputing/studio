import { CustomCellRendererProps } from 'ag-grid-react';

const ParametersCellRenderer = (
  props: CustomCellRendererProps<unknown, string, unknown>,
) => {
  return props.value ? (
    <div className="flex items-center">
      <span className="flex max-w-full items-center gap-2 overflow-hidden rounded-lg border-[thin] border-border bg-white px-2 py-1">
        <span className="line-clamp-2 max-w-full whitespace-normal leading-4">
          {props.value}
        </span>
      </span>
    </div>
  ) : null;
};
export default ParametersCellRenderer;
