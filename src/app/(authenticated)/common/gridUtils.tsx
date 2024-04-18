import { exhaustiveCheck } from '@/lib/typeUtils';
import { FilterChangedEvent, SortDirection } from 'ag-grid-community';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export function getTableColumnSortIcon(sort: SortDirection) {
  switch (sort) {
    case 'asc':
      return <ArrowDownIcon size={14} />;
    case 'desc':
      return <ArrowUpIcon size={14} />;
    case null:
      return null;
    default: {
      return exhaustiveCheck(sort);
    }
  }
}

export const onFilterChanged = (event: FilterChangedEvent) => {
  if (event.api.getDisplayedRowCount() === 0) {
    event.api.showNoRowsOverlay();
    return;
  }
  event.api.hideOverlay();
};
