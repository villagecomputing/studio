import { BaseRowInspectorBodyProps } from '../type';

export const BaseRowInspectorBody: React.FC<BaseRowInspectorBodyProps> = (
  props,
) => {
  const { children } = props;

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto px-6">
      {children}
    </div>
  );
};
