import Image from 'next/image';
import UploadDataButton from '../upload-data-button/UploadDataButton';

const ZeroState = () => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-border px-10 py-12">
      <Image
        src={'data-not-found.svg'}
        alt="data not found"
        width={69}
        height={76}
        className="mb-9"
      />
      <span className="my-4 text-base text-gray800">
        Upload some data to start evaluating it.
      </span>
      <UploadDataButton />
    </div>
  );
};

export default ZeroState;
