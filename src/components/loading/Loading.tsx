import { Loader2Icon } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2Icon className="animate-spin" />
    </div>
  );
};

export default Loading;
