import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownViewerProps = {
  content: string;
};
export const preprocessContent = (content: string): string => {
  const urlRegex =
    /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return content.replace(urlRegex, (url) => `<${url}>`);
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const [JSONText, setJSONText] = useState<string | undefined>();

  useEffect(() => {
    try {
      setJSONText(JSON.stringify(JSON.parse(content), null, 2));
    } catch (error) {
      setJSONText(undefined);
    }
  }, [content]);

  const processedContent = preprocessContent(content);

  return (
    <div className="flex-grow overflow-y-scroll px-6 py-4">
      <span className="text-base font-normal text-secondary-foreground">
        {JSONText && <pre>{JSONText}</pre>}
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
            {processedContent}
          </ReactMarkdown>
        )}
      </span>
    </div>
  );
};

export default MarkdownViewer;
