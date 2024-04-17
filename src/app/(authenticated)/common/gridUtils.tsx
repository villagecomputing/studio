import { exhaustiveCheck } from '@/lib/typeUtils';
import { SortDirection } from 'ag-grid-community';
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
