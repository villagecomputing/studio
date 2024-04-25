import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, ChevronUpIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type CollapsibleTextProps = {
  text: string;
  maxNumberOfLines?: number;
  maxCharsPerLine?: number;
};

export const CollapsibleText: React.FC<CollapsibleTextProps> = ({
  text,
  maxNumberOfLines = 10,
  maxCharsPerLine = 50,
}) => {
  const minCollapsibleSize = useMemo(
    () => maxNumberOfLines * maxCharsPerLine,
    [maxNumberOfLines, maxCharsPerLine],
  );
  const collapsible = text.length > minCollapsibleSize;
  const [collapsed, setCollapsed] = useState(collapsible);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  const buttonLabel = collapsed ? 'View all' : 'Collapse';

  return (
    <>
      <p
        className={cn(
          'text-base text-slateGray950',
          collapsed && `line-clamp-[${maxNumberOfLines}]`,
        )}
      >
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
          {collapsed ? text.slice(0, minCollapsibleSize) + '...' : text}
        </ReactMarkdown>
      </p>
      {collapsible && (
        <Button
          variant={'secondary'}
          className="flex h-8 w-fit cursor-pointer items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-primary"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
        >
          {buttonLabel}
          {collapsed ? (
            <ChevronRightIcon size={16} />
          ) : (
            <ChevronUpIcon size={16} />
          )}
        </Button>
      )}
    </>
  );
};
