export type Direction = 'NEXT' | 'PREVIOUS';

export type BaseRowInspectorProps = {
  type: RowInspectorType;
  open: boolean;
  children: React.ReactNode[];
  onNavigate: (direction: Direction) => void;
  onEnter: () => void;
  onEscape: () => void;
};

export type BaseRowInspectorHeaderProps = {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export type BaseRowInspectorBodyProps = {
  children: React.ReactNode;
};

export type BaseRowInspectorFooterProps = {
  children: React.ReactNode;
};

export enum RowInspectorType {
  DATASET = 'DATASET',
  EXPERIMENT = 'EXPERIMENT',
}
