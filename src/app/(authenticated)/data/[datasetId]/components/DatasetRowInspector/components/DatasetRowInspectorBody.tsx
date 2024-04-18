import { ENUM_Column_type } from '@/lib/types';

import { isGroundTruthCell } from '../../../../utils/commonUtils';
import { useDatasetRowInspectorContext } from '../DatasetRowInspector';
import { DatasetRowInspectorBodyElement } from './DatasetRowInspectorBodyElement';

const DatasetRowInspectorBody = () => {
  const { inspectorRowIndex, rows, columnDefs, setGroundTruthInputValue } =
    useDatasetRowInspectorContext();

  const currentRow =
    rows && inspectorRowIndex !== null ? rows[inspectorRowIndex] : null;

  if (!currentRow || inspectorRowIndex === null) {
    return <></>;
  }
  return (
    <div className="px-6">
      {columnDefs
        .filter((colDef) => colDef.type === ENUM_Column_type.INPUT)
        .map((colDef) => {
          if (!colDef.field || !colDef.headerName || !colDef.colId) {
            return <></>;
          }
          const cellContent = currentRow[colDef.field];
          if (isGroundTruthCell(cellContent)) {
            return;
          }
          return (
            <DatasetRowInspectorBodyElement
              key={colDef.colId}
              colType={ENUM_Column_type.INPUT}
              header={colDef.headerName}
              content={cellContent}
            />
          );
        })}
      <div className="sticky bottom-0 border-t-[1px] border-border bg-white">
        {columnDefs
          .filter((colDef) => colDef.type === ENUM_Column_type.GROUND_TRUTH)
          .map((colDef) => {
            const field = colDef.field;
            if (!field || !colDef.headerName) {
              return <></>;
            }
            const cellContent = currentRow[field];
            if (!isGroundTruthCell(cellContent)) {
              return;
            }

            return (
              <DatasetRowInspectorBodyElement
                key={colDef.colId}
                colType={colDef.type as ENUM_Column_type.GROUND_TRUTH}
                header={colDef.headerName}
                content={cellContent}
                onGroundTruthChange={(value) => {
                  setGroundTruthInputValue(value);
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default DatasetRowInspectorBody;
