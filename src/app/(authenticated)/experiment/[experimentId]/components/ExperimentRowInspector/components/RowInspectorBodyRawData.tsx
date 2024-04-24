import { LogsTableContext } from '@/app/(authenticated)/logs/[logsId]/types';
import { ENUM_Column_type } from '@/lib/types';
import Link from 'next/link';
import { ExperimentTableContext } from '../../../types';
import RowInspectorRichDataWrapper from './RowInspectorRichDataWrapper';

const RowInspectorBodyRawData = ({
  context,
  datasetId,
}: {
  context: ExperimentTableContext | LogsTableContext;
  datasetId?: string;
}) => {
  const { rows, inspectorRowIndex, columnDefs } = context;

  if (inspectorRowIndex === null) {
    return null;
  }

  const currentRow = rows[inspectorRowIndex];
  const inputColumns = columnDefs.filter(
    (colDef) => colDef.type === ENUM_Column_type.INPUT,
  );

  return (
    <div className="flex flex-col gap-6 border-y border-border bg-white p-6">
      <div className="flex justify-between text-base">
        <span>Raw Data</span>
        {datasetId && (
          <Link className="text-primary" href={`/data/${datasetId}`}>
            Open Dataset
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {inputColumns.map((colDef) => {
          const colField = colDef.field;
          if (!colField) {
            return <></>;
          }
          return (
            <div
              className="flex flex-col gap-1 border-l border-border px-2"
              key={colField}
            >
              <span className={'text-sm text-muted-foreground'}>
                {colDef.headerName}:
              </span>
              <RowInspectorRichDataWrapper
                data={(currentRow[colField] as string) || '-'}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RowInspectorBodyRawData;
