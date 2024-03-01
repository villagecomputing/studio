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
      <div className="flex w-full items-center gap-1">
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap">
          {colDef.headerName}
        </span>
        <div className="ml-auto flex-shrink-0">
          {!!sortIcon && sortIcon}
          {colDef.type !== ENUM_Column_type.GROUND_TRUTH && (
            <DropdownMenuTrigger className="flex h-full cursor-pointer items-center">
              <MoreVerticalIcon size={14} />
            </DropdownMenuTrigger>
          )}
        </div>
      </div>
      <DropdownMenuContent className="border-border">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            if (!colDef.colId) {
              return;
            }
            await markColumnAsType(
              Number(colDef.colId),
              colDef.type === ENUM_Column_type.INPUT
                ? ENUM_Column_type.PREDICTIVE_LABEL
                : ENUM_Column_type.INPUT,
            );
            props.context.updateCol(Number(colDef.colId), {
              type: ENUM_Column_type.PREDICTIVE_LABEL,
              pinned: 'right',
            });
          }}
        >
          {colDef.type === ENUM_Column_type.INPUT
            ? 'Set as Predicted Label'
            : 'Remove Predicted Label'}
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
