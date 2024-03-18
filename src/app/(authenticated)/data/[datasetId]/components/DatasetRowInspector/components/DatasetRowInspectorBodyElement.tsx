import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { exhaustiveCheck } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { MoreVerticalIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GroundTruthCell } from '../../../types';
import { isGroundTruthCell } from '../../../utils/commonUtils';
import { getTableColumnIcon } from '../../../utils/gridUtils';
import { DatasetRowInspectorBodyElementProps } from '../types';

export const INSPECTOR_DROPDOWN_ATTRIBUTE = 'inspector-dropdown-open';
interface RenderHeaderWithIconProps {
  icon?: React.ReactNode;
  header: string;
  updateCol?: (colTypeUpdate: ENUM_Column_type) => Promise<void>;
  colType: ENUM_Column_type;
}

const RenderHeaderWithIcon: React.FC<RenderHeaderWithIconProps> = ({
  icon,
  header,
  colType,
  updateCol,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleOpenDropdownMenu = (open: boolean) => {
    setIsDropdownOpen(open);
  };
  useEffect(() => {
    if (!isDropdownOpen) {
      setTimeout(
        () => document.body.removeAttribute(INSPECTOR_DROPDOWN_ATTRIBUTE),
        0,
      );
    }
    document.body.setAttribute(INSPECTOR_DROPDOWN_ATTRIBUTE, '');
    return () => {
      document.body.removeAttribute(INSPECTOR_DROPDOWN_ATTRIBUTE);
    };
  }, [isDropdownOpen]);

  return (
    <span className="flex items-center gap-1 text-sm text-greyText">
      {!!icon && <span>{icon}</span>}
      {header}
      {colType !== ENUM_Column_type.GROUND_TRUTH && (
        <DropdownMenu onOpenChange={handleOpenDropdownMenu}>
          <DropdownMenuTrigger className="flex h-full cursor-pointer items-center">
            <MoreVerticalIcon size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-overlay border-border">
            {(() => {
              switch (colType) {
                case ENUM_Column_type.INPUT:
                  return (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () =>
                        await updateCol?.(ENUM_Column_type.PREDICTIVE_LABEL)
                      }
                    >
                      Set as Label
                    </DropdownMenuItem>
                  );

                case ENUM_Column_type.PREDICTIVE_LABEL:
                  return (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () =>
                        await updateCol?.(ENUM_Column_type.INPUT)
                      }
                    >
                      Remove as Label
                    </DropdownMenuItem>
                  );
                default:
                  return <></>;
              }
            })()}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </span>
  );
};

interface InputColumnProps {
  header: string;
  content: string;
  updateCol: (colTypeUpdate: ENUM_Column_type) => Promise<void>;
}

const InputColumn: React.FC<InputColumnProps> = ({
  header,
  content,
  updateCol,
}) => (
  <div className="flex flex-col gap-1 py-4">
    <RenderHeaderWithIcon
      header={header}
      updateCol={updateCol}
      colType={ENUM_Column_type.INPUT}
    />
    <p className="text-base">{content || <i>Empty</i>}</p>
  </div>
);

interface PredictiveLabelColumnProps {
  header: string;
  icon?: React.ReactNode;
  content: string;
  isGTApproved: boolean;
  labelMatchColor: string;
  updateCol: (colTypeUpdate: ENUM_Column_type) => Promise<void>;
}

const PredictiveLabelColumn: React.FC<PredictiveLabelColumnProps> = ({
  header,
  icon,
  content,
  isGTApproved,
  labelMatchColor,
  updateCol,
}) => (
  <div className="flex flex-col gap-1 py-4">
    <RenderHeaderWithIcon
      icon={icon}
      header={header}
      updateCol={updateCol}
      colType={ENUM_Column_type.PREDICTIVE_LABEL}
    />
    <p
      className={`rounded-lg p-2 text-base ${isGTApproved ? labelMatchColor : 'bg-paleGrey'}`}
    >
      {content || <i>Empty</i>}
    </p>
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
      <RenderHeaderWithIcon
        icon={icon}
        header={header}
        colType={ENUM_Column_type.GROUND_TRUTH}
      />
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
  const { colType, content, header, updateCol } = props;
  const icon = getTableColumnIcon(colType) || undefined;

  switch (colType) {
    case ENUM_Column_type.INPUT:
      return (
        <InputColumn header={header} content={content} updateCol={updateCol} />
      );
    case ENUM_Column_type.PREDICTIVE_LABEL:
      const isGTApproved =
        props.gtContent?.status === ENUM_Ground_truth_status.APPROVED;
      const labelMatchColor =
        props.gtContent?.content === content
          ? 'bg-agOddGroundMatch'
          : 'bg-agWrongLabelColor';
      return (
        <PredictiveLabelColumn
          updateCol={updateCol}
          header={header}
          icon={icon}
          content={content}
          isGTApproved={isGTApproved}
          labelMatchColor={labelMatchColor}
        />
      );
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
