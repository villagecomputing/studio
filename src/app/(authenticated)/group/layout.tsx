import { ExperimentListProvider } from '../experiment/components/ExperimentListProvider';

export default function GroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ExperimentListProvider>{children}</ExperimentListProvider>;
}
