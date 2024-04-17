import { EditableCallbackParams } from 'ag-grid-community';
import { DatasetRow, DatasetTableViewModeEnum } from '../../[datasetId]/types';

export function isEditableGroundTruth(
  params: EditableCallbackParams<DatasetRow, unknown>,
) {
  return !(
    params.context.tableViewMode === DatasetTableViewModeEnum.PREVIEW ||
    (params.node.isRowPinned() && params.node.rowPinned === 'bottom')
  );
}
