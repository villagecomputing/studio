import { LogsListProvider } from './components/LogsListProvider';

export default function LogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LogsListProvider>{children}</LogsListProvider>;
}
