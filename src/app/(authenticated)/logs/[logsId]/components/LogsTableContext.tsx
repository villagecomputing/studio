import { StepMetadataColumn } from '@/app/(authenticated)/experiment/[experimentId]/types';
import { logsStepInputs } from '@/app/api/logs/insert/schema';
import { CurrentView } from '@/lib/services/RichDataParser/types';
import { Enum_Logs_Column_Type } from '@/lib/types';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { compact } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { AGGridLogs, LogsRow, LogsTableContext } from '../types';
import { LogsTableProps } from './LogsTable';

export const useLogsTableContext = (
  props: LogsTableProps,
): LogsTableContext => {
  const gridRef = useRef<AgGridReactType<LogsRow>>();
  const [rows, setRows] = useState<AGGridLogs['rowData']>(props.rowData);
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

  const [sidePanelCurrentView, setSidePanelCurrentView] =
    useState<CurrentView | null>(null);

  useEffect(() => {
    setSidePanelCurrentView(null);
  }, [inspectorRowIndex]);

  /**
   * Transform the input columns from
   * [{name: 'FIELD_NAME', value: 'FIELD_VALUE'}...]
   * to: [{'FIELD_NAME': 'FIELD_VALUE'}...]
   */
  useEffect(() => {
    const inputColumnsFields = compact(
      displayableColumnDefs
        .filter((column) => column.type === Enum_Logs_Column_Type.INPUT)
        .map((colDef) => colDef.field),
    );
    const transformedRows = props.rowData.map((row) => {
      const transformedRow = { ...row };
      for (const [key, value] of Object.entries(row)) {
        if (!inputColumnsFields.includes(key) || typeof value === 'boolean') {
          continue;
        }
        const parsedValue = logsStepInputs.safeParse(JSON.parse(value));
        if (!parsedValue.success) {
          continue;
        }
        transformedRow[key] = JSON.stringify(
          parsedValue.data.reduce(
            (
              acc: Record<string, string>,
              { name, value }: z.infer<typeof logsStepInputs>[number],
            ) => {
              acc[name] = value;
              return acc;
            },
            {},
          ),
        );
      }
      return transformedRow;
    });
    setRows(transformedRows);
  }, [props.rowData, displayableColumnDefs]);

  useEffect(() => {
    const parsedColumns = props.columnDefs.filter((column) => {
      return (
        column.type === Enum_Logs_Column_Type.OUTPUT ||
        column.type === Enum_Logs_Column_Type.INPUT ||
        column.type === Enum_Logs_Column_Type.ROW_METADATA ||
        column.type === Enum_Logs_Column_Type.TIMESTAMP ||
        column.type === Enum_Logs_Column_Type.CHECKBOX_SELECTION
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
    sidePanelCurrentView,
    setSidePanelCurrentView,
    setInspectorRowIndex,
    setRowIdsToCopyToDataset: props.setRowIdsToCopyToDataset,
  };
};
