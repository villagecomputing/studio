import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';

const PageHeader = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div
      className={cn([
        'flex items-center justify-between gap-2 px-6',
        !children && 'justify-end',
      ])}
    >
      {children}
      <UserButton />
    </div>
  );
};

export default PageHeader;
