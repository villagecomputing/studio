import Loading from '@/components/loading/Loading';
import { cn } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

export const ImageWithFallback = (
  props: ImageProps & { fallbackSrc?: string },
) => {
  const [src, setSrc] = useState(props.src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <div
        className={cn([
          'h-full w-full',
          isLoading ? 'relative' : 'flex items-center justify-center',
        ])}
      >
        {isLoading && (
          <div
            className={cn([
              'absolute inset-0 flex items-center justify-center',
            ])}
          >
            <Loading />
          </div>
        )}
        <Image
          {...props}
          alt={props.alt}
          src={src}
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth === 0) {
              setSrc(props.fallbackSrc || '/image-failed-to-load.svg');
            }
            setIsLoading(false);
          }}
          onError={() => {
            setSrc(props.fallbackSrc || '/image-failed-to-load.svg');
            setIsLoading(false);
          }}
          style={{ visibility: isLoading ? 'hidden' : 'visible' }}
        />
      </div>
    </>
  );
};
