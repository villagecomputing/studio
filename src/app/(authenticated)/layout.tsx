'use client';
import { cn } from '@/lib/utils';
import Navbar from './components/navbar/Navbar';
import { UploadDataProvider } from './data/components/upload-data-dialog/UploadDataProvider';

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn(['flex h-full w-full'])}>
      <Navbar />
      <div className={cn(['flex-1 py-4'])}>
        <UploadDataProvider>{children}</UploadDataProvider>
      </div>
    </div>
  );
}
