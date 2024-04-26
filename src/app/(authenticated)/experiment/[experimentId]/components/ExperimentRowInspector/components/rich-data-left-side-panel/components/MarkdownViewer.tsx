import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LeftSidePanelHeader from './LeftSidePanelHeader';

type MarkdownViewerProps = {
  closePanel: () => void;
  content: string;
  title: string;
};
const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  title,
  closePanel,
}) => {
  return (
    <div className="flex h-full flex-col">
      <LeftSidePanelHeader closePanel={closePanel}>
        <span className="truncate text-base font-normal text-secondary-foreground">
          {title}
        </span>
      </LeftSidePanelHeader>
      <div className="flex-grow overflow-y-scroll px-6 py-4">
        <span className="text-base font-normal text-secondary-foreground">
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
            {content}
          </ReactMarkdown>
        </span>
      </div>
    </div>
  );
};

export default MarkdownViewer;
