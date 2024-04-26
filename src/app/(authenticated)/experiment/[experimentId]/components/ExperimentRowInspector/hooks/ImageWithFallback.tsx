import Loading from '@/components/loading/Loading';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

export const ImageWithFallback = (
  props: ImageProps & { fallbackSrc?: string },
) => {
  const [src, setSrc] = useState(props.src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Loading />}
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
    </>
  );
};
