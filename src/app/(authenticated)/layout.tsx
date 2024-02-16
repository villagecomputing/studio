import { cn } from '@/lib/utils';
import Navbar from './components/navbar/Navbar';

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn(['flex h-full w-full'])}>
      <Navbar />
      <div className={cn(['flex-1 py-4'])}>{children}</div>
    </div>
  );
}
