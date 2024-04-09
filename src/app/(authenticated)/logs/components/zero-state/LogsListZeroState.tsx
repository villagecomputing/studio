import Image from 'next/image';

const LogsListZeroState = () => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-border px-10 py-12">
      <Image
        src={'experiments-not-found.svg'}
        alt="Experiments not found"
        width={69}
        height={76}
        className="mb-9"
      />
      <span className="my-4 text-base text-gray800">No logs added</span>
    </div>
  );
};

export default LogsListZeroState;
