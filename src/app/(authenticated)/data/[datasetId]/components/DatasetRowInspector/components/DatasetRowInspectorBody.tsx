import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { exhaustiveCheck } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { GroundTruthCell } from '../../../types';
import { getTableColumnIcon, isGroundTruthCell } from '../../../utils';
import { useDatasetRowInspectorContext } from '../DatasetRowInspectorView';
import { DatasetRowInspectorBodyElementProps } from '../types';

const DatasetRowInspectorBodyElement = (
  props: DatasetRowInspectorBodyElementProps,
) => {
  const { colType, content, header } = props;
  const { register } = useForm<{ gtContent: string }>({
    values: {
      gtContent: isGroundTruthCell(content) ? content.content : '',
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
          <p className={cn(['text-base'])}>{content || <i>Empty</i>}</p>
        </div>
      );
    case ENUM_Column_type.PREDICTIVE_LABEL:
      const isGTApproved =
        props.gtContent?.status === ENUM_Ground_truth_status.APPROVED;
      const labelMatchColor =
        props.gtContent?.content === content
          ? 'bg-agOddGroundMatch'
          : 'bg-agWrongLabelColor';
      return (
        <div className="flex flex-col gap-1 py-4">
          <span className="flex items-center gap-1 text-sm text-greyText">
            {!!icon && <span>{icon}</span>}
            {header}
          </span>
          <p
            className={cn([
              'rounded-lg  p-2 text-base',
              isGTApproved ? labelMatchColor : 'bg-paleGrey',
            ])}
          >
            {content || <i>Empty</i>}
          </p>
        </div>
      );
    case ENUM_Column_type.GROUND_TRUTH:
      return (
        <div className="flex flex-col gap-1 py-4">
          <span className="flex items-center gap-1 text-sm text-greyText">
            {!!icon && <span>{icon}</span>}
            {header}
          </span>
          <Input
            {...register('gtContent')}
            onChange={(event) =>
              event.target.value !== content.content &&
              props.onGroundTruthChange(event.target.value)
            }
            className={
              content.status === ENUM_Ground_truth_status.APPROVED
                ? 'bg-agOddGroundMatch'
                : ''
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
  const {
    inspectorRowIndex,
    rows,
    columnDefs,
    setGroundTruthInputValue,
    groundTruthColumnField,
    setInspectorRowIndex,
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
              <XIcon size={16} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col overflow-y-auto px-6">
          {columnDefs
            .filter((colDef) => colDef.type === ENUM_Column_type.INPUT)
            .map((colDef) => {
              if (!colDef.field || !colDef.headerName) {
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
                />
              );
            })}
          <div className="sticky bottom-0 border-t-[1px] border-border bg-white">
            {columnDefs
              .filter(
                (colDef) => colDef.type === ENUM_Column_type.PREDICTIVE_LABEL,
              )
              .map((colDef) => {
                if (!colDef.field || !colDef.headerName) {
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
