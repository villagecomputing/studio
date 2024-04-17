import { IRowNode } from 'ag-grid-community';
import { DatasetRow, GroundTruthCell } from '../../[datasetId]/types';
import { isGroundTruthCell } from '../commonUtils';

export function predictiveLabelComparator(
  valueA: string,
  valueB: string,
  nodeA: IRowNode<DatasetRow>,
  nodeB: IRowNode<DatasetRow>,
) {
  const nodeAData = nodeA.data;
  const nodeBData = nodeB.data;
  if (!nodeAData || !nodeBData) {
    return 0;
  }
  const groundTruthField = Object.keys(nodeAData).find((key) =>
    isGroundTruthCell(nodeAData[key]),
  );
  if (!groundTruthField) {
    return 0;
  }

  const groundTruthA = nodeAData[groundTruthField] as GroundTruthCell;
  const groundTruthB = nodeBData[groundTruthField] as GroundTruthCell;
  if (!groundTruthA || !groundTruthB) {
    return 0;
  }

  const nodeAValue = valueA === groundTruthA.content ? 1 : 0;
  const nodeBValue = valueB === groundTruthB.content ? 1 : 0;
  return nodeAValue - nodeBValue;
}
