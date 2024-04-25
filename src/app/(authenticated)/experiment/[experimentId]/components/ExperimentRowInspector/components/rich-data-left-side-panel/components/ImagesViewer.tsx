import { Button } from '@/components/ui/button';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import LeftSidePanelHeader from './LeftSidePanelHeader';

type ImagesViewerProps = {
  closePanel: () => void;
  imagesUrls: string[];
  options?: EmblaOptionsType;
};
const ImagesViewer: React.FC<ImagesViewerProps> = ({
  imagesUrls,
  options,
  closePanel,
}) => {
  // TODO: to use options.startIndex to start from a specific image
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);
  const selectedImage = emblaApi
    ? imagesUrls[emblaApi?.selectedScrollSnap()]
    : null;

  return (
    <div className="flex h-full flex-col">
      <LeftSidePanelHeader closePanel={closePanel}>
        {selectedImage && (
          <a
            href={selectedImage}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-primary"
          >
            {selectedImage}
          </a>
        )}
      </LeftSidePanelHeader>
      <div className="relative flex flex-grow overflow-hidden" ref={emblaRef}>
        <div className="flex items-center">
          {imagesUrls.map((image, index) => (
            <div className="w-full flex-none" key={index}>
              <Image
                alt={image}
                src={image}
                width={1000}
                height={1000}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
        <Button
          variant={'ghost'}
          className="absolute left-0 top-1/2 -translate-y-1/2 transform bg-[#000000c5] p-3 hover:bg-gridCellTextColor"
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
        >
          <ChevronLeftIcon color="white" />
        </Button>
        <Button
          variant={'ghost'}
          className="absolute right-0 top-1/2 -translate-y-1/2 transform bg-[#000000c5] p-3 hover:bg-gridCellTextColor"
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
        >
          <ChevronRightIcon color="white" />
        </Button>
      </div>
    </div>
  );
};

export default ImagesViewer;

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};
