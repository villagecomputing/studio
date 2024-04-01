import { ENUM_Column_type } from '@/lib/types';
import { GroundTruthCell } from '../../../types';

import { isGroundTruthCell } from '../../../../utils/commonUtils';
import { markColumnAsType } from '../../../actions';
import { useDatasetRowInspectorContext } from '../DatasetRowInspector';
import { DatasetRowInspectorBodyElement } from './DatasetRowInspectorBodyElement';

const DatasetRowInspectorBody = () => {
  const {
    inspectorRowIndex,
    rows,
    columnDefs,
    setGroundTruthInputValue,
    groundTruthColumnField,
    updateCol,
  } = useDatasetRowInspectorContext();

  const handleColumnUpdate = async (
    colId: number,
    colTypeUpdated: ENUM_Column_type,
  ) => {
    await markColumnAsType(colId, colTypeUpdated);
    updateCol(colId, {
      type: colTypeUpdated,
      pinned: colTypeUpdated !== ENUM_Column_type.INPUT ? 'right' : false,
    });
  };

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
              gtContent={null}
              updateCol={async (colTypeUpdate: ENUM_Column_type) =>
                await handleColumnUpdate(Number(colDef.colId), colTypeUpdate)
              }
            />
          );
        })}
      <div className="sticky bottom-0 border-t-[1px] border-border bg-white">
        {columnDefs
          .filter((colDef) => colDef.type === ENUM_Column_type.PREDICTIVE_LABEL)
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
                colType={ENUM_Column_type.PREDICTIVE_LABEL}
                header={colDef.headerName}
                content={cellContent}
                updateCol={async (colTypeUpdate: ENUM_Column_type) =>
                  await handleColumnUpdate(Number(colDef.colId), colTypeUpdate)
                }
                gtContent={
                  groundTruthColumnField
                    ? (currentRow[groundTruthColumnField] as GroundTruthCell)
                    : null
                }
              />
            );
          })}
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
                updateCol={async (colTypeUpdate: ENUM_Column_type) =>
                  await handleColumnUpdate(Number(colDef.colId), colTypeUpdate)
                }
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
