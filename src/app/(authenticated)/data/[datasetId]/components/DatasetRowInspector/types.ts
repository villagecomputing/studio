import { ENUM_Column_type } from '@/lib/types';
import { DatasetTableContext, GroundTruthCell } from '../../types';

export type DatasetRowInspectorFooterProps = {
  onSkipRow: () => void;
  onApproveRow: () => void;
};

export type DatasetRowInspectorProps = {
  context: DatasetTableContext;
};

export type UseDatasetRowInspectorData = {
  approveRow: () => Promise<void>;
  navigateTo: (direction: 'NEXT' | 'PREVIOUS') => void;
};

export type DatasetRowInspectorBodyElementProps =
  | {
      colType: ENUM_Column_type.INPUT | ENUM_Column_type.PREDICTIVE_LABEL;
      header: string;
      content: string;
      gtContent: GroundTruthCell | null;
    }
  | {
      colType: ENUM_Column_type.GROUND_TRUTH;
      header: string;
      content: GroundTruthCell;
      onGroundTruthChange: (value: string) => void;
    };

export type DatasetRowInspectorContext =
  | ({
      groundTruthInputValue: string;
      setGroundTruthInputValue: (value: string) => void;
    } & DatasetTableContext)
  | undefined;
