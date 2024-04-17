import { ExperimentListProvider } from './components/ExperimentListProvider';

export default function ExperimentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ExperimentListProvider>{children}</ExperimentListProvider>;
}
