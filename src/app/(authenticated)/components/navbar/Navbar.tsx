'use client';
import { cn } from '@/lib/utils';
import { ClipboardListIcon, DatabaseIcon, ListTodoIcon } from 'lucide-react';
import { useState } from 'react';
import NavbarMenu from './components/NavbarMenu';
import NavbarMenuCollapsed from './components/NavbarMenuCollapsed';
import { NavbarMenuItemProps } from './components/NavbarMenuItem';

export const NavbarItems: NavbarMenuItemProps[] = [
  {
    route: '/data',
    name: 'Data',
    Icon: <DatabaseIcon size={20} />,
  },
  {
    route: '/experiment',
    name: 'Experiments',
    Icon: <ListTodoIcon size={20} />,
  },
  {
    route: '/evaluate',
    name: 'Evaluate',
    Icon: <ClipboardListIcon size={20} />,
    disabled: true,
  },
];

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn([
        'flex h-full flex-col bg-paleBlueGrey drop-shadow',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : ' w-48',
      ])}
    >
      {collapsed ? (
        <NavbarMenuCollapsed toggleCollapse={() => setCollapsed(false)} />
      ) : (
        <NavbarMenu toggleCollapse={() => setCollapsed(true)} />
      )}
    </div>
  );
}
