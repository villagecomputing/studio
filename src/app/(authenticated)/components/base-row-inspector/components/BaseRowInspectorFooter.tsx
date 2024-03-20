import { BaseRowInspectorFooterProps } from '../type';

export const BaseRowInspectorFooter: React.FC<BaseRowInspectorFooterProps> = (
  props,
) => {
  const { children } = props;

  return (
    <div className="flex h-20 w-full items-center justify-end gap-4 border-t-[1px] border-border px-6">
      {children}
    </div>
  );
};
