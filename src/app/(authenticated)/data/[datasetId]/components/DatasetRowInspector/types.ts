import { ENUM_Column_type } from '@/lib/types';
import { DatasetTableContext, GroundTruthCell } from '../../types';

export type DatasetRowInspectorProps = {
  context: DatasetTableContext;
};

export type UseDatasetRowInspectorData = {
  groundTruthCell: GroundTruthCell | null;
  approveRow: () => Promise<void>;
  navigateTo: (direction: 'NEXT' | 'PREVIOUS') => void;
};

export type DatasetRowInspectorBodyElementProps = {
  header: string;
  updateCol: (colTypeUpdated: ENUM_Column_type) => Promise<void>;
} & (
  | {
      colType: ENUM_Column_type.INPUT | ENUM_Column_type.PREDICTIVE_LABEL;
      content: string;
      gtContent: GroundTruthCell | null;
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
