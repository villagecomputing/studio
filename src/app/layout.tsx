import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const inter = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LabelKit',
  description: 'LabelKit',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html className={cn(['h-full w-full'])} lang="en">
        <body className={cn(['h-full w-full', inter.className])}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
