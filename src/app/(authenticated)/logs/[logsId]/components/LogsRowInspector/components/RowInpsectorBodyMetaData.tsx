import { useMemo } from 'react';
import { getLogsRowMetadata } from '../../../utils';
import MetadataElement, { Enum_Metadata_Type } from '../../MetadataElement';
import { useLogsRowInspectorContext } from '../LogsRowInspector';
import { RAW_DATA_SECTION } from '../LogsRowInspectorView';

const RowInspectorBodyMetaData = () => {
  const {
    rows,
    inspectorRowIndex,
    stepMetadataColumns,
    costP25,
    costP75,
    latencyP25,
    latencyP75,
  } = useLogsRowInspectorContext();

  const metadata = useMemo(() => {
    if (inspectorRowIndex === null) {
      return null;
    }
    const currentRow = rows[inspectorRowIndex];
    return getLogsRowMetadata(currentRow, stepMetadataColumns);
  }, [inspectorRowIndex, rows, stepMetadataColumns]);

  if (!metadata) {
    return null;
  }

  return (
    <div
      id={RAW_DATA_SECTION}
      className="flex gap-6 border-y border-border bg-white px-4 py-3 text-agDataColor"
    >
      <MetadataElement
        type={Enum_Metadata_Type.LATENCY90}
        icon
        value={metadata.latencySum}
        p25={latencyP25}
        p75={latencyP75}
      />
      <MetadataElement
        type={Enum_Metadata_Type.COST}
        icon
        value={metadata.costSum}
        p25={costP25}
        p75={costP75}
      />
      <span>
        <b>{metadata.inputTokensSum}</b> Input tokens
      </span>
      <span>
        <b>{metadata.outputTokensSum}</b> Output tokens
      </span>
    </div>
  );
};

export default RowInspectorBodyMetaData;
