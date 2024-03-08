import { Button } from '@/components/ui/button';
import { ENUM_Column_type } from '@/lib/types';
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { GroundTruthCell } from '../../../types';

import { isGroundTruthCell } from '../../../utils/commonUtils';
import { useDatasetRowInspectorContext } from '../DatasetRowInspectorView';
import { DatasetRowInspectorBodyElement } from './DatasetRowInspectorBodyElement';

const DatasetRowInspectorBody = () => {
  const {
    inspectorRowIndex,
    rows,
    columnDefs,
    setGroundTruthInputValue,
    groundTruthColumnField,
    setInspectorRowIndex,
    updateCol,
  } = useDatasetRowInspectorContext();

  const currentRow =
    rows && inspectorRowIndex !== null ? rows[inspectorRowIndex] : null;

  if (!currentRow || inspectorRowIndex === null) {
    return <></>;
  }
  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-col">
        <div className="flex h-16 items-center justify-between border-b-[1px] border-border bg-white p-6">
          <span>Row {inspectorRowIndex}</span>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              Use <b>Up</b>
              <span className="flex h-6 w-6 items-center justify-center rounded border border-border text-secondary-foreground">
                <ArrowUpIcon height={24} width={14} />
              </span>
              and <b>Down</b>
              <span className="flex h-6 w-6 items-center justify-center rounded border border-border text-secondary-foreground">
                <ArrowDownIcon height={24} width={14} />
              </span>
              keys to navigate
            </span>
            <Button
              onClick={() => {
                setInspectorRowIndex(null);
              }}
              variant={'outline'}
              className="h-7 w-7 p-0 text-secondary-foreground"
            >
              <XIcon size={14} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col overflow-y-auto px-6">
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
                  colId={Number(colDef.colId)}
                  updateCol={updateCol}
                />
              );
            })}
          <div className="sticky bottom-0 border-t-[1px] border-border bg-white">
            {columnDefs
              .filter(
                (colDef) => colDef.type === ENUM_Column_type.PREDICTIVE_LABEL,
              )
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
                    colId={Number(colDef.colId)}
                    updateCol={updateCol}
                    gtContent={
                      groundTruthColumnField
                        ? (currentRow[
                            groundTruthColumnField
                          ] as GroundTruthCell)
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
                    colId={Number(colDef.colId)}
                    updateCol={updateCol}
                    onGroundTruthChange={(value) => {
                      setGroundTruthInputValue(value);
                    }}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DatasetRowInspectorBody;
