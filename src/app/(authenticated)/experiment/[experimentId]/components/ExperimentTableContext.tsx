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
    setColumnDefs(props.columnDefs);
    setDisplayableColumnDefs(parsedColumns);
  }, [props.columnDefs]);

  // Handles the row highlighting (selected) to match the inspector row index
  useEffect(() => {
    const gridApi = gridRef.current?.api;
    if (!gridApi) {
      return;
    }
    const visibleNodes = gridApi.getRenderedNodes();
    const shouldSelectNode = inspectorRowIndex !== null;
    const selectedNode = visibleNodes.find((node) =>
      shouldSelectNode
        ? node.rowIndex === inspectorRowIndex
        : node.isSelected(),
    );
    if (!selectedNode) {
      return;
    }
    gridApi.setNodesSelected({
      nodes: [selectedNode],
      newValue: shouldSelectNode,
    });
    // Schedule the call to ensureNodeVisible to avoid lifecycle warning
    setTimeout(() => gridApi.ensureNodeVisible(selectedNode), 0);
  }, [inspectorRowIndex, gridRef]);

  return {
    datasetId: props.dataset.id,
    stepMetadataColumns,
    inspectorRowIndex,
    gridRef,
    rows,
    columnDefs,
    displayableColumnDefs,
    setInspectorRowIndex,
  };
};
