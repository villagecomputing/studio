import { Input } from '@/components/ui/input';
import { exhaustiveCheck } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { GroundTruthCell } from '../../../types';
import { getTableColumnIcon } from '../../../utils';
import { useDatasetRowInspectorContext } from '../DatasetRowInspectorView';
import { DatasetRowInspectorBodyElementProps } from '../types';

const DatasetRowInspectorBodyElement = (
  props: DatasetRowInspectorBodyElementProps,
) => {
  const { colType, content, header } = props;
  const { register } = useForm<{ gtContent: string }>({
    values: {
      gtContent: content,
    },
  });
  const icon = getTableColumnIcon(colType);
  switch (colType) {
    case ENUM_Column_type.INPUT:
      return (
        <div className="flex flex-col gap-1 py-4">
          <span className="flex items-center gap-1 text-sm text-greyText">
            {header}
          </span>
          <p className={cn(['text-base'])}>{content}</p>
        </div>
      );
    case ENUM_Column_type.PREDICTIVE_LABEL:
      return (
        <div className="flex flex-col gap-1 py-4">
          <span className="flex items-center gap-1 text-sm text-greyText">
            {!!icon && <span>{icon}</span>}
            {header}
          </span>
          <p className={'rounded-lg bg-paleGrey p-2 text-base'}>{content}</p>
        </div>
      );
    case ENUM_Column_type.GROUND_TRUTH:
      return (
        <div className="sticky bottom-0 flex flex-col gap-1 border-t-[1px] border-border bg-white py-4 pb-7">
          <span className="flex items-center gap-1 text-sm text-greyText">
            {!!icon && <span>{icon}</span>}
            {header}
          </span>
          <Input
            {...register('gtContent')}
            onBlur={(event) =>
              event.target.value !== content &&
              props.onGroundTruthChange(event.target.value)
            }
          ></Input>
        </div>
      );
    default:
      exhaustiveCheck(colType);
      return <></>;
  }
};

const DatasetRowInspectorBody = () => {
  const { inspectorRowIndex, rowData, columnDefs, updateGroundTruthCell } =
    useDatasetRowInspectorContext();

  const currentRow =
    rowData && inspectorRowIndex !== null ? rowData[inspectorRowIndex] : null;

  if (!currentRow) {
    return <></>;
  }
  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-col">
        <div className="flex h-16 items-center justify-between border-b-[1px] border-border bg-white p-6">
          <span>Row {inspectorRowIndex}</span>
          <span className="flex items-center gap-1 text-sm text-greyText">
            Use <b>Up</b>
            <ArrowUpIcon /> and <b>Down</b>
            <ArrowDownIcon /> keys to navigate through rows
          </span>
        </div>
        <div className="flex flex-col overflow-y-auto px-6">
          {columnDefs
            .filter((colDef) => colDef.type === ENUM_Column_type.INPUT)
            .map((colDef) => {
              if (!colDef.field || !colDef.headerName) {
                return <></>;
              }
              return (
                <DatasetRowInspectorBodyElement
                  key={colDef.colId}
                  colType={ENUM_Column_type.INPUT}
                  header={colDef.headerName}
                  content={currentRow[colDef.field]}
                />
              );
            })}
          {columnDefs
            .filter(
              (colDef) => colDef.type === ENUM_Column_type.PREDICTIVE_LABEL,
            )
            .map((colDef) => {
              if (!colDef.field || !colDef.headerName) {
                return <></>;
              }
              return (
                <DatasetRowInspectorBodyElement
                  key={colDef.colId}
                  colType={ENUM_Column_type.PREDICTIVE_LABEL}
                  header={colDef.headerName}
                  content={currentRow[colDef.field]}
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
              const gtCell: GroundTruthCell = currentRow[field];

              return (
                <DatasetRowInspectorBodyElement
                  key={colDef.colId}
                  colType={colDef.type as ENUM_Column_type}
                  header={colDef.headerName}
                  content={currentRow[field].content}
                  onGroundTruthChange={(value) =>
                    colDef.colId &&
                    updateGroundTruthCell(
                      gtCell.id,
                      value,
                      ENUM_Ground_truth_status.APPROVED,
                    )
                  }
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default DatasetRowInspectorBody;