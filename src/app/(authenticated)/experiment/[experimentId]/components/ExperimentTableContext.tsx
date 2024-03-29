import { ENUM_Column_type, Enum_Experiment_Column_Type } from '@/lib/types';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import _ from 'lodash';
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
  const [stepMetadataColumns, setStepMetadataColumn] = useState<
    { name: string; field: string }[]
  >([]);
  const [columnDefs, setColumnDefs] = useState<AGGridExperiment['columnDefs']>(
    props.columnDefs,
  );
  const [inspectorRowIndex, setInspectorRowIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const parsedColumns = props.columnDefs.filter((column) => {
      // TODO Add the aggregated Meta column here as well
      return (
        column.type === Enum_Experiment_Column_Type.OUTPUT ||
        column.type === ENUM_Column_type.INPUT ||
        column.type === Enum_Experiment_Column_Type.ROW_METADATA
      );
    });
    const stepMetadataColumns = props.columnDefs.filter(
      (col) => col.type === Enum_Experiment_Column_Type.STEP_METADATA,
    );
    setStepMetadataColumn(
      _.compact(
        stepMetadataColumns.map((col) => {
          if (!col.field || !col.headerName) {
            return null;
          }
          return { name: col.headerName, field: col.field };
        }),
      ),
    );
    setColumnDefs(parsedColumns);
  }, [props.columnDefs]);

  return {
    costP25: props.costP25,
    costP75: props.costP75,
    latencyP25: props.latencyP25,
    latencyP75: props.latencyP75,
    stepMetadataColumns,
    inspectorRowIndex,
    gridRef,
    rows,
    columnDefs,
    setInspectorRowIndex,
  };
};
