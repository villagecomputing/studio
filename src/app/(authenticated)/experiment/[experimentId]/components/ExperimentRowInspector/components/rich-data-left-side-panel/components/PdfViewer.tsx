type PdfViewerProps = {
  pdfUrl: string;
};
const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
  return (
    <div className="w-full flex-grow">
      <embed width={'100%'} height={'100%'} src={pdfUrl}></embed>
    </div>
  );
};

export default PdfViewer;
