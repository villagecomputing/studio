import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavbarMenuItemProps = {
  route: Route;
  name?: string;
  Icon: React.ReactNode;
};

export default function NavbarMenuItem(props: NavbarMenuItemProps) {
  const currentRoute = usePathname();
  const { route, name, Icon } = props;
  const isActive = currentRoute === route || currentRoute.includes(`${route}/`);

  return (
    <Button
      asChild
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn([
        'text-greyText',
        isActive ? 'text-primary' : '',
        'h-12 p-3 hover:text-primary',
      ])}
    >
      <Link href={route}>
        <span
          className={cn([
            'flex aspect-auto w-full gap-2 text-left',
            name ? 'justify-start' : 'justify-center',
          ])}
        >
          {Icon}
          {name}
        </span>
      </Link>
    </Button>
  );
}
