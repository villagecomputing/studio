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
import { sortBy } from 'lodash';
import { MoreVerticalIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { markColumnAsType } from '../actions';
import {
  DatasetRow,
  DatasetTableContext,
  DatasetTableViewModeEnum,
} from '../types';
import { ROW_ID_FIELD_NAME, getTableColumnSortIcon } from '../utils';

export type HeaderComponentParams =
  | {
      // tableRef: React.RefObject<AgGridReact>;
      leftSideIcon: JSX.Element;
    }
  | undefined;

export default function CustomHeaderComponent(
  props: CustomHeaderProps<DatasetRow, DatasetTableContext>,
) {
  const { column } = props;
  const [sortOrder, setSortOrder] = useState<SortDirection>(null);
  const colDef = column.getColDef();
  const headerComponentParams =
    colDef.headerComponentParams as HeaderComponentParams;
  const icon = headerComponentParams?.leftSideIcon;
  const sortIcon = getTableColumnSortIcon(sortOrder);

  const propagateNodesOrderToContext = useCallback(
    (sortOrder: SortDirection | undefined) => {
      const rows: DatasetRow[] = [];
      props.api.forEachNodeAfterFilterAndSort((node) => {
        if (!node.data) {
          return;
        }
        rows.push(node.data);
      });
      if (sortOrder === null) {
        props.context.updateRows(
          sortBy(rows, (row) => Number(row[ROW_ID_FIELD_NAME])),
        );
        return;
      }
      props.context.updateRows(rows);
    },
    [props.api, props.context],
  );

  const sort = useCallback(() => {
    props.progressSort();
    propagateNodesOrderToContext(column.getSort());
  }, [props, column, propagateNodesOrderToContext]);

  useEffect(() => {
    const sortChangedListener = () => {
      setSortOrder(column.getSort() ?? null);
    };

    column.addEventListener('sortChanged', sortChangedListener);
    return () => {
      column.removeEventListener('sortChanged', sortChangedListener);
    };
  }, []);

  return (
    <DropdownMenu>
      <div className="flex w-full items-center justify-between">
        <div
          className="flex w-full cursor-pointer items-center gap-1 rounded-sm p-1 hover:bg-agGridHeaderHoverGrey"
          onClick={sort}
        >
          <span className="flex-shrink-0">{icon}</span>
          <span className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap">
            {colDef.headerName}
          </span>
          {!!sortIcon && sortIcon}
        </div>
        <div className="flex-shrink-0">
          {(colDef.type !== ENUM_Column_type.GROUND_TRUTH ||
            props.context.tableViewMode !==
              DatasetTableViewModeEnum.PREVIEW) && (
            <DropdownMenuTrigger className="flex h-full cursor-pointer items-center">
              <MoreVerticalIcon size={14} />
            </DropdownMenuTrigger>
          )}
        </div>
      </div>
      <DropdownMenuContent className="border-border">
        {colDef.type !== ENUM_Column_type.GROUND_TRUTH && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              if (!colDef.colId) {
                return;
              }
              const type =
                colDef.type === ENUM_Column_type.INPUT
                  ? ENUM_Column_type.PREDICTIVE_LABEL
                  : ENUM_Column_type.INPUT;
              const pinned =
                type === ENUM_Column_type.PREDICTIVE_LABEL ? 'right' : false;

              await markColumnAsType(Number(colDef.colId), type);
              props.context.updateCol(Number(colDef.colId), {
                type,
                pinned,
              });
            }}
          >
            {colDef.type === ENUM_Column_type.INPUT
              ? 'Set as Predicted Label'
              : 'Remove Predicted Label'}
          </DropdownMenuItem>
        )}
        {colDef.type === ENUM_Column_type.GROUND_TRUTH && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              if (colDef.type !== ENUM_Column_type.GROUND_TRUTH) {
                return;
              }
              await props.context.approveAll();
            }}
          >
            Approve all
          </DropdownMenuItem>
        )}
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
