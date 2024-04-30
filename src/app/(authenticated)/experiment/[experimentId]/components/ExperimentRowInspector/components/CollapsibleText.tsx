import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type CollapsibleTextProps = {
  content: string;
  maxNumberOfLines?: number;
  maxCharsPerLine?: number;
  collapsed: boolean;
  toggleCollapsed: () => void;
};

export const CollapsibleText: React.FC<CollapsibleTextProps> = ({
  content,
  maxNumberOfLines = 10,
  maxCharsPerLine = 50,
  collapsed,
  toggleCollapsed,
}) => {
  const [JSONText, setJSONText] = useState<string | undefined>();
  const minCollapsibleSize = useMemo(
    () => maxNumberOfLines * maxCharsPerLine,
    [maxNumberOfLines, maxCharsPerLine],
  );
  const collapsible = content.length > minCollapsibleSize;

  const buttonLabel = collapsed ? 'Open' : 'Close';

  useEffect(() => {
    try {
      setJSONText(JSON.stringify(JSON.parse(content), null, 2));
    } catch (error) {
      setJSONText(undefined);
    }
  }, [content]);

  return (
    <>
      <p className={cn('text-base text-slateGray950')}>
        {JSONText && (
          <pre>{collapsible ? JSONText.slice(0, 100) + '...' : JSONText}</pre>
        )}
        {!JSONText && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => (
                <a
                  {...props}
                  className="mb-2 break-all text-primary hover:underline"
                />
              ),
            }}
          >
            {collapsible
              ? content.slice(0, minCollapsibleSize) + '...'
              : content}
          </ReactMarkdown>
        )}
      </p>
      {collapsible && (
        <Button
          variant={'secondary'}
          className="flex h-8 w-fit cursor-pointer items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-primary"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
        >
          {buttonLabel}
        </Button>
      )}
    </>
  );
};
