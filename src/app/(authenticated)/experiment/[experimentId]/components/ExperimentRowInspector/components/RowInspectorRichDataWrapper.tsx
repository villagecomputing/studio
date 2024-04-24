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
      <CollapsibleText text={data} />
      {components}
    </>
  );
};

export default RowInspectorRichDataWrapper;
