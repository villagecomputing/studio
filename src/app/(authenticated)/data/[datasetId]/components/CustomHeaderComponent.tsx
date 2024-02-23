'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AgGridReact, CustomHeaderProps } from 'ag-grid-react';
import { MoreVerticalIcon } from 'lucide-react';

export type HeaderComponentParams =
  | {
      tableRef: React.RefObject<AgGridReact>;
      leftSideIcon: JSX.Element;
    }
  | undefined;

const MenuItems = [
  { label: 'Set as Predicted Label' },
  { label: 'Set as Ground Truth Label' },
  { label: 'Rename' },
  { label: 'Hide' },
  { label: 'Delete' },
];

export default function CustomHeaderComponent(props: CustomHeaderProps) {
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
        {MenuItems.map((item, index) => (
          <DropdownMenuItem key={index} className="cursor-pointer">
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
