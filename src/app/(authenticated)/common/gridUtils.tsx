import { exhaustiveCheck } from '@/lib/typeUtils';
import { FilterChangedEvent, SortDirection } from 'ag-grid-community';
import { isAfter, isBefore, isEqual, startOfDay } from 'date-fns';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { DateRangeFilter } from './types';

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

export const isExternalFilterPresent = (
  dateRange: DateRangeFilter['dateRange'],
) => {
  return dateRange !== undefined;
};

export const doesExternalFilterPass = (
  createdAt: string,
  dateRange: DateRangeFilter['dateRange'],
) => {
  if (!dateRange || !dateRange.from) {
    return true;
  }
  if (
    !createdAt ||
    typeof createdAt !== 'string' ||
    isNaN(Date.parse(createdAt))
  ) {
    return false;
  }

  const startOfCreatedAt = startOfDay(createdAt);
  if (
    isEqual(startOfCreatedAt, dateRange.from) ||
    (!!dateRange.to &&
      isAfter(startOfCreatedAt, dateRange.from) &&
      (isBefore(startOfCreatedAt, dateRange.to) ||
        isEqual(startOfCreatedAt, dateRange.to)))
  ) {
    return true;
  }
  return false;
};
