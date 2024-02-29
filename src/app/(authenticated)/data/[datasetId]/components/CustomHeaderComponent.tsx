'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ENUM_Column_type } from '@/lib/types';
import { SortDirection } from 'ag-grid-community';
import { CustomHeaderProps } from 'ag-grid-react';
import { MoreVerticalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { markColumnAsType } from '../actions';
import { DatasetTableContext, TableColumnProps } from '../types';
import { getTableColumnSortIcon } from '../utils';

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
  const [sortOrder, setSortOrder] = useState<SortDirection>(null);
  const colDef = column.getColDef();
  const headerComponentParams =
    colDef.headerComponentParams as HeaderComponentParams;
  const icon = headerComponentParams?.leftSideIcon;

  // const sort = () => {
  //   props.progressSort();
  // };

  useEffect(() => {
    column.addEventListener('sortChanged', () => {
      setSortOrder(column.getSort() ?? null);
    });
  }, []);

  const sortIcon = getTableColumnSortIcon(sortOrder);

  return (
    <DropdownMenu>
      <div className="flex flex-1 cursor-pointer items-center gap-1">
        {icon}
        {colDef.headerName}
        {!!sortIcon && sortIcon}
      </div>
      <DropdownMenuTrigger className="flex h-full items-center">
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
        {/* <DropdownMenuItem className="cursor-pointer">
          {'Set as Ground Truth Label'}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          {'Rename'}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">{'Hide'}</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          {'Delete'}
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
