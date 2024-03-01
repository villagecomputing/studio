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
            className="mx-auto mt-2"
            src={'/logo-small.svg'}
            alt="LabelKit Logo"
            width={28}
            height={28}
          />

          <Button
            variant={'link'}
            className={'p-0 text-greyText'}
            onClick={toggleCollapse}
          >
            <ChevronsRightIcon size={20} />
          </Button>
          {NavbarItems.map((item) => (
            <NavbarMenuItem key={item.route} {...item} />
          ))}
        </div>
      </div>
    </>
  );
}
