import { Enum_Logs_Column_Type } from '@/lib/types';
import { ColDef } from 'ag-grid-community';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';
import {
  AGGridDataset,
  DatasetTableColumnProps,
} from '../../data/[datasetId]/types';
import {
  StepMetadataColumn,
  StepsMetadataPercentiles,
} from '../../experiment/[experimentId]/types';

export type LogsViewPageProps = {
  params: {
    logsId: string;
  };
};

export type AGGridLogs = {
  logsId: string;
  columnDefs: ColDef[];
  rowData: LogsRow[];
};

export type LogsTableColumnProps = {
  id: number;
  name: string;
  field: string;
  type: Enum_Logs_Column_Type;
};

export type ConvertToAGGridDataProps = {
  logsId: string;
  columns: (LogsTableColumnProps | DatasetTableColumnProps)[];
  rows: LogsRow[];
};

export type LogsRow = {
  [k: string]: string;
};

export type FetchLogsResult = AGGridLogs & {
  logsName: string;
  latencyP50: number;
  latencyP90: number;
  runtime: number;
  cost: number;
  accuracy: number;
  parameters: string;
  costP25: number;
  costP75: number;
  latencyP25: number;
  latencyP75: number;
  stepsMetadataPercentiles: StepsMetadataPercentiles;
};

export type LogsTableContext = {
  costP25: number;
  costP75: number;
  latencyP25: number;
  latencyP75: number;
  stepsMetadataPercentiles: StepsMetadataPercentiles;
  stepMetadataColumns: StepMetadataColumn[];
  inspectorRowIndex: number | null;
  setInspectorRowIndex: Dispatch<SetStateAction<number | null>>;
  rows: LogsRow[];
  columnDefs: AGGridDataset['columnDefs'];
  displayableColumnDefs: AGGridDataset['columnDefs'];
  gridRef: MutableRefObject<AgGridReactType<LogsRow> | undefined>;
};

export type DateRangeFilter = {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
};
