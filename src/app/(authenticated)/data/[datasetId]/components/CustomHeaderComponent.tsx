'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ENUM_Column_type } from '@/lib/types';
import { CustomHeaderProps } from 'ag-grid-react';
import { MoreVerticalIcon } from 'lucide-react';
import { markColumnAsType } from '../actions';
import { DatasetTableContext, TableColumnProps } from '../types';

export type HeaderComponentParams =
  | {
      // tableRef: React.RefObject<AgGridReact>;
      leftSideIcon: JSX.Element;
    }
  | undefined;

export default function CustomHeaderComponent(
  props: CustomHeaderProps<TableColumnProps, DatasetTableContext>,
) {
  const { column } = props;
  const colDef = column.getColDef();
  const headerComponentParams =
    colDef.headerComponentParams as HeaderComponentParams;
  const icon = headerComponentParams?.leftSideIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-full w-full items-center justify-between">
        <div className="flex items-center gap-1">
          {icon}
          {colDef.headerName}
        </div>
        <MoreVerticalIcon size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-border">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await markColumnAsType(
              Number(colDef.colId),
              ENUM_Column_type.PREDICTIVE_LABEL,
            );
            props.context.refreshData();
          }}
        >
          {'Set as Predicted Label'}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          {'Set as Ground Truth Label'}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          {'Rename'}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">{'Hide'}</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          {'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
