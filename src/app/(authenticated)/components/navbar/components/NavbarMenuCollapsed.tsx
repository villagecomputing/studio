import { Button } from '@/components/ui/button';
import { ChevronsRightIcon } from 'lucide-react';
import Image from 'next/image';
import { NavbarItems } from '../Navbar';
import NavbarMenuItem from './NavbarMenuItem';

export default function NavbarMenuCollapsed(props: {
  toggleCollapse: () => void;
}) {
  const { toggleCollapse } = props;
  return (
    <>
      <div className="mt-2 w-full px-2">
        <div className="flex flex-col gap-2">
          <Image
            className="mx-auto mt-2 h-10 w-10"
            src={'/logo-small.svg'}
            alt="Stelo Logo"
            width={40}
            height={40}
          />

          <Button variant={'link'} className={'p-0'} onClick={toggleCollapse}>
            <ChevronsRightIcon />
          </Button>
          {NavbarItems.map((item) => (
            <NavbarMenuItem
              key={item.route}
              route={item.route}
              Icon={item.Icon}
            />
          ))}
        </div>
      </div>
    </>
  );
}
