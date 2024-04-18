import { ENUM_Column_type } from '@/lib/types';
import { DatasetTableContext, GroundTruthCell } from '../../types';

export type DatasetRowInspectorProps = {
  context: DatasetTableContext;
};

export type UseDatasetRowInspectorData = {
  approveRow: () => Promise<void>;
  navigateTo: (direction: 'NEXT' | 'PREVIOUS') => void;
};

export type DatasetRowInspectorBodyElementProps = {
  header: string;
} & (
  | {
      colType: ENUM_Column_type.INPUT;
      content: string;
    }
  | {
      colType: ENUM_Column_type.GROUND_TRUTH;
      content: GroundTruthCell;
      onGroundTruthChange: (value: string) => void;
    }
);

export type DatasetRowInspectorContext =
  | ({
      groundTruthInputValue: string;
      setGroundTruthInputValue: (value: string) => void;
    } & DatasetTableContext)
  | undefined;
