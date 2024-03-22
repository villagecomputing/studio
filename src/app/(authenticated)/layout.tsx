import { cn } from '@/lib/utils';
import Navbar from './components/navbar/Navbar';
import { ExperimentListProvider } from './experiment/components/ExperimentListProvider';

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ExperimentListProvider>
      <div className={cn(['flex h-full w-full'])}>
        <Navbar />
        <div className={cn(['flex-1 pt-4'])}>{children}</div>
      </div>
    </ExperimentListProvider>
  );
}
