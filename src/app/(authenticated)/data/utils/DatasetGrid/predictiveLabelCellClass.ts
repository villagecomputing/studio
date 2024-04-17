import { CellClassParams } from 'ag-grid-community';
import { DatasetRow } from '../../[datasetId]/types';
import { isGroundTruthCell } from '../commonUtils';

export function predictiveLabelCellClass(
  params: CellClassParams<DatasetRow, unknown>,
) {
  if (
    !params.context.groundTruthColumnField ||
    params.node.isRowPinned() ||
    !params.data
  ) {
    return '';
  }

  const groundTruthCell = params.data[params.context.groundTruthColumnField];
  if (!isGroundTruthCell(groundTruthCell)) {
    return '';
  }
  const matchesGroundTruth =
    groundTruthCell && params.value === groundTruthCell.content;

  return matchesGroundTruth
    ? 'predictiveLabelCell match'
    : 'predictiveLabelCell noMatch';
}
