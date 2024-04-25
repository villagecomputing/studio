import ReactMarkdown from 'react-markdown';
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
          <ReactMarkdown>{content}</ReactMarkdown>
        </span>
      </div>
    </div>
  );
};

export default MarkdownViewer;
