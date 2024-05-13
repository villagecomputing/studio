import { CurrentView } from '@/lib/services/RichDataParser/types';
import { Enum_Logs_Column_Type } from '@/lib/types';
import { ColDef } from 'ag-grid-community';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';
import { AGGridDataset } from '../../data/[datasetId]/types';
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
  columns: LogsTableColumnProps[];
  rows: Record<string, string | null>[];
};

export type LogsRow = {
  [k: string]: string | boolean | null;
};

export type FetchLogsResult = AGGridLogs & {
  logsName: string;
  description?: string;
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
  datasetUuid?: string;
  datasetName?: string;
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
  sidePanelCurrentView: CurrentView | null;
  dateRange: DateRange | undefined;
  description?: string;
  setSidePanelCurrentView: Dispatch<SetStateAction<CurrentView | null>>;
  setRowIdsToCopyToDataset: Dispatch<SetStateAction<string[]>>;
};
