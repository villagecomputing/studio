import { ENUM_Column_type } from '@/lib/types';
import Link from 'next/link';
import { useLogsRowInspectorContext } from '../LogsRowInspector';

const RowInspectorBodyRawData = () => {
  const { rows, inspectorRowIndex, columnDefs, datasetId } =
    useLogsRowInspectorContext();

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
        <Link className="text-primary" href={`/data/${datasetId}`}>
          Open Dataset
        </Link>
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
              <p className="text-base text-slateGray950">
                {(currentRow[colField] as string) || '-'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RowInspectorBodyRawData;
