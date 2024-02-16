import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';

const DataLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={cn(['px-6'])}>
      <Breadcrumb />
      {children}
    </div>
  );
};

export default DataLayout;
