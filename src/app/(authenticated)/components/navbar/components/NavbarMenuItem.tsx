import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavbarMenuItemProps = {
  route: Route;
  name?: string;
  Icon: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
};

export default function NavbarMenuItem(props: NavbarMenuItemProps) {
  const currentRoute = usePathname();
  const { route, name, Icon, disabled } = props;
  const isActive = currentRoute === route || currentRoute.includes(`${route}/`);

  return (
    <Button
      asChild={!disabled}
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn([
        'text-greyText',
        isActive ? 'text-primary' : '',
        'h-12 p-3 hover:text-primary',
        name ? 'justify-start' : 'justify-center',
      ])}
      disabled={disabled}
    >
      <Link href={route}>
        <span className={cn(['flex aspect-auto w-full gap-2 text-left'])}>
          {Icon}
          {name}
        </span>
      </Link>
    </Button>
  );
}
