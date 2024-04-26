import { CollapsibleText } from '@/app/(authenticated)/components/base-row-inspector/components/CollapsibleText';
import { SupportedFormat } from '@/lib/services/RichDataParser/constants';
import { CurrentView } from '@/lib/services/RichDataParser/types';
import React from 'react';
import { useGetRichDataComponents } from '../hooks/useGetRichDataComponents';

type RowInspectorRichDataWrapperProps = {
  title?: string;
  content: string;
  currentViewContent: CurrentView | null;
  setCurrentViewContent: (currentViewContent: CurrentView | null) => void;
};

const RowInspectorRichDataWrapper: React.FC<
  RowInspectorRichDataWrapperProps
> = (props) => {
  const { content, title, currentViewContent, setCurrentViewContent } = props;
  const collapsed =
    !currentViewContent || currentViewContent.type !== SupportedFormat.MARKDOWN;
  const components = useGetRichDataComponents(content, setCurrentViewContent);

  const toggleCollapsed = () => {
    const contextText: CurrentView = {
      content,
      title: title || '',
      type: SupportedFormat.MARKDOWN,
    };
    setCurrentViewContent(collapsed ? contextText : null);
  };

  return (
    <>
      <div className="mb-2">
        <CollapsibleText
          content={content}
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
        />
      </div>
      {components}
    </>
  );
};

export default RowInspectorRichDataWrapper;
