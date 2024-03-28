import { ENUM_Column_type, Enum_Experiment_Column_Type } from '@/lib/types';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { useEffect, useRef, useState } from 'react';
import {
  AGGridExperiment,
  ExperimentRow,
  ExperimentTableContext,
  FetchExperimentResult,
} from '../types';

export const useExperimentTableContext = (
  props: FetchExperimentResult,
): ExperimentTableContext => {
  const gridRef = useRef<AgGridReactType<ExperimentRow>>();
  const [rows] = useState<AGGridExperiment['rowData']>(props.rowData);
  const [columnDefs, setColumnDefs] = useState<AGGridExperiment['columnDefs']>(
    props.columnDefs,
  );
  const [displayableColumnDefs, setDisplayableColumnDefs] = useState<
    AGGridExperiment['columnDefs']
  >([]);
  const [inspectorRowIndex, setInspectorRowIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const parsedColumns = props.columnDefs.filter((column) => {
      // TODO Add the aggregated Meta column here as well
      return (
        column.type === Enum_Experiment_Column_Type.OUTPUT ||
        column.type === ENUM_Column_type.INPUT
      );
    });
    setDisplayableColumnDefs(parsedColumns);
    setColumnDefs(props.columnDefs);
  }, [props.columnDefs]);

  return {
    datasetId: props.dataset.id,
    inspectorRowIndex,
    gridRef,
    rows,
    columnDefs,
    displayableColumnDefs,
    setInspectorRowIndex,
  };
};
