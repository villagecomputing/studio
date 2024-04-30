import LeftSidePanelContent from '@/app/(authenticated)/experiment/[experimentId]/components/ExperimentRowInspector/components/rich-data-left-side-panel/components/LeftSidePanelContent';
import { cn } from '@/lib/utils';
import { useLogsRowInspectorContext } from './LogsRowInspector';

const LogsLeftSidePanel = () => {
  const context = useLogsRowInspectorContext();
  const { inspectorRowIndex, sidePanelCurrentView, setSidePanelCurrentView } =
    context;
  const open = inspectorRowIndex !== null && sidePanelCurrentView !== null;

  if (!open) {
    return null;
  }

  const closePanel = () => {
    setSidePanelCurrentView(null);
  };

  return (
    <div
      className={cn([
        'absolute bottom-0 right-[var(--inspectorViewWidth)] top-[144px] z-inspectorView w-sidePanel border border-gridBorderColor bg-gridHeaderColor',
      ])}
    >
      <div
        className="absolute bottom-0 left-[-25px] top-0 z-inspectorView w-6"
        style={{
          background:
            'linear-gradient(270deg, rgba(0, 0, 0, 0.08) 0%, rgba(102, 102, 102, 0.00) 100%)',
        }}
      ></div>

      <LeftSidePanelContent
        currentView={sidePanelCurrentView}
        closePanel={closePanel}
      />
    </div>
  );
};

export default LogsLeftSidePanel;
