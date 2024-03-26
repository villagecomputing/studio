import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { useRef, useState } from 'react';
import {
  AGGridExperiment,
  ExperimentRow,
  ExperimentTableContext,
} from '../types';

export const useExperimentTableContext = (
  props: AGGridExperiment,
): ExperimentTableContext => {
  const gridRef = useRef<AgGridReactType<ExperimentRow>>();
  const [rows] = useState<AGGridExperiment['rowData']>(props.rowData);
  const [columnDefs] = useState<AGGridExperiment['columnDefs']>(
    props.columnDefs,
  );
  const [inspectorRowIndex, setInspectorRowIndex] = useState<number | null>(
    null,
  );

  return {
    inspectorRowIndex,
    gridRef,
    rows,
    columnDefs,
    setInspectorRowIndex,
  };
};
