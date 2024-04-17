import { cn } from '@/lib/utils';
import ProfileManagementButton from '../user-button/ProfileManagementButton';

const PageHeader = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div
      className={cn([
        'flex items-center justify-between gap-2 px-6',
        !children && 'justify-end',
      ])}
    >
      {children}
      <ProfileManagementButton />
    </div>
  );
};

export default PageHeader;
