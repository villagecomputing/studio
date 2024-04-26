import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownViewerProps = {
  content: string;
};
const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
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
  );
};

export default MarkdownViewer;
