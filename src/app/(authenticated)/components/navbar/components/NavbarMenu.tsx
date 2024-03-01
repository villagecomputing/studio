import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronsLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { NavbarItems } from '../Navbar';
import NavbarMenuItem from './NavbarMenuItem';

export default function NavbarMenu(props: { toggleCollapse: () => void }) {
  const { toggleCollapse } = props;
  return (
    <>
      <div className={cn(['mb-4 flex justify-between p-4'])}>
        <Image
          src={'/logo-large.svg'}
          priority
          alt="LabelKit Logo"
          height={24}
          width={114}
        />

        <Button
          variant={'link'}
          className="h-6 p-2 text-greyText"
          onClick={toggleCollapse}
        >
          <ChevronsLeftIcon size={20} />
        </Button>
      </div>
      <div className="w-full px-3">
        <div className="flex flex-col gap-2">
          {NavbarItems.map((item) => (
            <NavbarMenuItem key={item.route} {...item} />
          ))}
        </div>
      </div>
    </>
  );
}
