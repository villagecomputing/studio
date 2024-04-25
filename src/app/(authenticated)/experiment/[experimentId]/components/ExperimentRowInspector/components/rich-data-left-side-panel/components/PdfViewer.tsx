import LeftSidePanelHeader from './LeftSidePanelHeader';

type PdfViewerProps = {
  closePanel: () => void;
  pdfUrl: string;
};
const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, closePanel }) => {
  return (
    <div className="flex h-full flex-col">
      <LeftSidePanelHeader closePanel={closePanel}>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-primary hover:underline"
        >
          {pdfUrl}
        </a>
      </LeftSidePanelHeader>
      <div className="w-full flex-grow">
        <embed width={'100%'} height={'100%'} src={pdfUrl}></embed>
      </div>
    </div>
  );
};

export default PdfViewer;
