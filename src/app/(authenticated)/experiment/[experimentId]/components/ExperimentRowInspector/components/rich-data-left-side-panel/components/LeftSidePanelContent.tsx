import { SupportedFormat } from '@/lib/services/RichDataParser/constants';
import { CurrentView } from '@/lib/services/RichDataParser/types';
import { exhaustiveCheck } from '@/lib/typeUtils';
import { useEffect, useState } from 'react';
import ImagesViewer from './ImagesViewer';
import LeftSidePanelHeader from './LeftSidePanelHeader';
import MarkdownViewer from './MarkdownViewer';
import PdfViewer from './PdfViewer';

type LeftSidePanelContentProps = {
  currentView: CurrentView;
  closePanel: () => void;
};
const LeftSidePanelContent: React.FC<LeftSidePanelContentProps> = ({
  currentView,
  closePanel,
}) => {
  const [title, setTitle] = useState<string | null>(null);
  const type = currentView.type;

  useEffect(() => {
    switch (type) {
      case SupportedFormat.IMAGE:
        if (currentView.startIndex < currentView.content.length) {
          setTitle(currentView.content[currentView.startIndex]);
        }
        break;
      case SupportedFormat.PDF:
        setTitle(currentView.content);
        break;
      case SupportedFormat.MARKDOWN:
        setTitle(currentView.title);
        break;
      default:
        exhaustiveCheck(type);
    }
  }, [currentView]);

  return (
    <>
      <div className="flex h-full flex-col">
        <LeftSidePanelHeader closePanel={closePanel}>
          {title &&
            (currentView.type === SupportedFormat.MARKDOWN ? (
              <span className="truncate text-base font-normal text-secondary-foreground">
                {title}
              </span>
            ) : (
              <a
                href={title}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-primary hover:underline"
              >
                {title}
              </a>
            ))}
        </LeftSidePanelHeader>
        {(() => {
          switch (type) {
            case SupportedFormat.IMAGE:
              return (
                <ImagesViewer
                  imagesUrls={currentView.content}
                  setSelectedImageUrl={setTitle}
                  options={{ startIndex: currentView.startIndex }}
                />
              );
            case SupportedFormat.PDF:
              return <PdfViewer pdfUrl={currentView.content} />;
            case SupportedFormat.MARKDOWN:
              return <MarkdownViewer content={currentView.content} />;
            default:
              exhaustiveCheck(type);
              return null;
          }
        })()}
      </div>
    </>
  );
};

export default LeftSidePanelContent;
