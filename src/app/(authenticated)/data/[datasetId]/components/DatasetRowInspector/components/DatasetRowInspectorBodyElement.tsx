import DatasetGrid from '@/app/(authenticated)/data/utils/DatasetGrid';
import { Input } from '@/components/ui/input';
import { exhaustiveCheck } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { isGroundTruthCell } from '../../../../utils/commonUtils';
import { GroundTruthCell } from '../../../types';
import { DatasetRowInspectorBodyElementProps } from '../types';

export const INSPECTOR_DROPDOWN_ATTRIBUTE = 'inspector-dropdown-open';
interface RenderHeaderWithIconProps {
  icon?: React.ReactNode;
  header: string;
}

const RenderHeaderWithIcon: React.FC<RenderHeaderWithIconProps> = ({
  icon,
  header,
}) => {
  return (
    <span className="flex items-center gap-1 text-sm text-greyText">
      {!!icon && <span>{icon}</span>}
      {header}
    </span>
  );
};

interface InputColumnProps {
  header: string;
  content: string;
}

const InputColumn: React.FC<InputColumnProps> = ({ header, content }) => (
  <div className="flex flex-col gap-1 py-4">
    <RenderHeaderWithIcon header={header} />
    <p className="text-base">{content || <i>Empty</i>}</p>
  </div>
);

interface GroundTruthColumnProps {
  header: string;
  icon?: React.ReactNode;
  content: GroundTruthCell;
  onGroundTruthChange: (value: string) => void;
}

const GroundTruthColumn: React.FC<GroundTruthColumnProps> = ({
  header,
  icon,
  content,
  onGroundTruthChange,
}) => {
  const { register } = useForm<{ gtContent: string }>({
    values: {
      gtContent: isGroundTruthCell(content) ? content.content : '',
    },
  });
  return (
    <div className="flex flex-col gap-1 py-4">
      <RenderHeaderWithIcon icon={icon} header={header} />
      <Input
        {...register('gtContent')}
        onChange={(event) =>
          event.target.value !== content.content &&
          onGroundTruthChange(event.target.value)
        }
        className={
          content.status === ENUM_Ground_truth_status.APPROVED
            ? 'bg-agOddGroundMatch'
            : ''
        }
      ></Input>
    </div>
  );
};

export const DatasetRowInspectorBodyElement: React.FC<
  DatasetRowInspectorBodyElementProps
> = (props) => {
  const { colType, content, header } = props;
  const icon = DatasetGrid.getTableColumnIcon(colType) || undefined;

  switch (colType) {
    case ENUM_Column_type.INPUT:
      return <InputColumn header={header} content={content} />;
    case ENUM_Column_type.GROUND_TRUTH:
      return (
        <GroundTruthColumn
          header={header}
          icon={icon}
          content={content}
          onGroundTruthChange={props.onGroundTruthChange}
        />
      );
    default:
      exhaustiveCheck(colType);
      return <></>;
  }
};
