import { SupportedFormat } from '@/lib/services/RichDataParser/constants';
import { CurrentView } from '@/lib/services/RichDataParser/types';
import { exhaustiveCheck } from '@/lib/typeUtils';
import ImagesViewer from './ImagesViewer';
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
  const type = currentView.type;

  return (() => {
    switch (type) {
      case SupportedFormat.IMAGE:
        return (
          <ImagesViewer
            imagesUrls={currentView.content}
            closePanel={closePanel}
          />
        );
      case SupportedFormat.PDF:
        return (
          <PdfViewer pdfUrl={currentView.content} closePanel={closePanel} />
        );
      case SupportedFormat.MARKDOWN:
        return (
          <MarkdownViewer
            content={currentView.content}
            title={currentView.title}
            closePanel={closePanel}
          />
        );
      default:
        exhaustiveCheck(type);
        return null;
    }
  })();
};

export default LeftSidePanelContent;
