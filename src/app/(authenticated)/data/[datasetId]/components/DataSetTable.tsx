'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { ENUM_Column_type } from '@/lib/types';
import { GridOptions, ValueParserParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useRef } from 'react';
import { AGGridDataset } from '../types';
import { getTableColumnIcon } from '../utils';
import { HeaderComponentParams } from './CustomHeaderComponent';
import { useDatasetTableContext } from './DatasetTableContext';
import GroundTruthCellRenderer from './GroundTruthCellRenderer';
import PredictiveLabelCellRenderer from './PredictiveLabelCellRenderer';

export default function DataSetTable(props: AGGridDataset) {
  const { rowData, columnDefs, pinnedBottomRowData } = props;
  const tableRef = useRef<AgGridReact>(null);
  const context = useDatasetTableContext(props);

  // See https://www.ag-grid.com/react-data-grid/column-definitions/#default-column-definitions
  const columnTypes: GridOptions['columnTypes'] = useMemo(() => {
    return {
      [ENUM_Column_type.INPUT]: { editable: false },
      [ENUM_Column_type.PREDICTIVE_LABEL]: {
        editable: false,
        headerComponentParams: {
          leftSideIcon: getTableColumnIcon(ENUM_Column_type.PREDICTIVE_LABEL),
        } as HeaderComponentParams,
        cellRenderer: PredictiveLabelCellRenderer,
      },
      [ENUM_Column_type.GROUND_TRUTH]: {
        editable: (params) => {
          return !(
            params.node.isRowPinned() && params.node.rowPinned === 'bottom'
          );
        },
        pinned: 'right',
        headerComponentParams: {
          leftSideIcon: getTableColumnIcon(ENUM_Column_type.GROUND_TRUTH),
        } as HeaderComponentParams,
        // TODO: Maybe use cellRendererSelector to have separate cell renderer for the pinned bottom row?
        cellRenderer: GroundTruthCellRenderer,
      },
    };
  }, []);

  const dataTypeDefinitions: GridOptions['dataTypeDefinitions'] =
    useMemo(() => {
      return {
        groundTruth: {
          baseDataType: 'object',
          extendsDataType: 'object',
          valueParser: (params) => {
            return {
              content: params.newValue,
              id: (params as ValueParserParams).oldValue?.id,
              status: (params as ValueParserParams).oldValue?.status,
            };
          },
          valueFormatter: (params) => {
            return params.value.content;
          },
          dataTypeMatcher: (value) =>
            value && !!value.content && !!value.id && !!value.status,
        },
      };
    }, []);

  return (
    <DataTable
      theme="ag-theme-dataset"
      tableRef={tableRef}
      agGridProps={{
        rowData,
        columnDefs,
        context,
        columnTypes,
        pinnedBottomRowData,
        dataTypeDefinitions,
        reactiveCustomComponents: true,
      }}
    />
  );
}
