import { ColDef } from 'ag-grid-community';
import { ExperimentTableContext } from '../../types';

export type ExperimentRowInspectorProps = {
  context: ExperimentTableContext;
};

export type ExperimentRowInspectorContext = ExperimentTableContext | undefined;

export type RowInspectorHeaderStepsProps = {
  onStepSelected: (stepColumnField: string) => void;
  columnDefs: ColDef[];
};

export type UseExperimentRowInspectorData = {
  navigateTo: (direction: 'NEXT' | 'PREVIOUS') => void;
};
