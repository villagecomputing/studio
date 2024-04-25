import { CollapsibleText } from '@/app/(authenticated)/components/base-row-inspector/components/CollapsibleText';
import React from 'react';
import { useGetRichDataComponents } from '../hooks/useGetRichDataComponents';

type RowInspectorRichDataWrapperProps = {
  data: string;
};

const RowInspectorRichDataWrapper: React.FC<
  RowInspectorRichDataWrapperProps
> = (props) => {
  const { data } = props;
  const components = useGetRichDataComponents(data);

  return (
    <>
      <div className="mb-2">
        <CollapsibleText text={data} />
      </div>
      {components}
    </>
  );
};

export default RowInspectorRichDataWrapper;
