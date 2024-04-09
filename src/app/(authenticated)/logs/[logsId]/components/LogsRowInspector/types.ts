import { LogsTableContext } from '../../types';

export type LogsRowInspectorProps = {
  context: LogsTableContext;
};

export type LogsRowInspectorContext = LogsTableContext | undefined;

export type RowInspectorHeaderStepsProps = {
  onStepSelected: (stepColumnField: string) => void;
};

export type UseLogsRowInspectorData = {
  navigateTo: (direction: 'NEXT' | 'PREVIOUS') => void;
};
