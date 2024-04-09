import { ENUM_Column_type, Enum_Logs_Column_Type } from '@/lib/types';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { compact } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  AGGridLogs,
  FetchLogsResult,
  LogsRow,
  LogsTableContext,
  StepMetadataColumn,
} from '../types';

export const useLogsTableContext = (
  props: FetchLogsResult,
): LogsTableContext => {
  const gridRef = useRef<AgGridReactType<LogsRow>>();
  const [rows] = useState<AGGridLogs['rowData']>(props.rowData);
  const [stepMetadataColumns, setStepMetadataColumn] = useState<
    StepMetadataColumn[]
  >([]);
  const [columnDefs, setColumnDefs] = useState<AGGridLogs['columnDefs']>(
    props.columnDefs,
  );
  const [displayableColumnDefs, setDisplayableColumnDefs] = useState<
    AGGridLogs['columnDefs']
  >([]);
  const [inspectorRowIndex, setInspectorRowIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const parsedColumns = props.columnDefs.filter((column) => {
      // TODO Add the aggregated Meta column here as well
      return (
        column.type === Enum_Logs_Column_Type.OUTPUT ||
        column.type === ENUM_Column_type.INPUT ||
        column.type === Enum_Logs_Column_Type.ROW_METADATA
      );
    });
    const stepMetadataColumns = props.columnDefs.filter(
      (col) => col.type === Enum_Logs_Column_Type.STEP_METADATA,
    );
    setStepMetadataColumn(
      compact(
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
    costP25: props.costP25,
    costP75: props.costP75,
    latencyP25: props.latencyP25,
    latencyP75: props.latencyP75,
    stepsMetadataPercentiles: props.stepsMetadataPercentiles,
    stepMetadataColumns,
    inspectorRowIndex,
    gridRef,
    rows,
    columnDefs,
    displayableColumnDefs,
    setInspectorRowIndex,
  };
};
