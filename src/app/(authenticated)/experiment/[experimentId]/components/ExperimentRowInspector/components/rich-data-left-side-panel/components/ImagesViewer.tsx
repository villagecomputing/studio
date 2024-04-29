import { Button } from '@/components/ui/button';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ImageWithFallback } from '../../../hooks/ImageWithFallback';

type ImagesViewerProps = {
  imagesUrls: string[];
  options?: EmblaOptionsType;
  setSelectedImageUrl: Dispatch<SetStateAction<string | null>>;
};
const ImagesViewer: React.FC<ImagesViewerProps> = ({
  imagesUrls,
  options,
  setSelectedImageUrl,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    selectedImageIndex,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, options?.startIndex ?? 0);

  useEffect(() => {
    setSelectedImageUrl(
      selectedImageIndex !== null && selectedImageIndex < imagesUrls.length
        ? imagesUrls[selectedImageIndex]
        : null,
    );
  }, [selectedImageIndex]);

  return (
    <div className="relative flex flex-grow overflow-hidden" ref={emblaRef}>
      <div className="flex w-full items-center ">
        {imagesUrls.map((image, index) => (
          <div className="h-full w-full flex-none" key={`${image}${index}`}>
            <ImageWithFallback
              alt={`Slide ${index}`}
              src={image}
              width={1000}
              height={1000}
              fallbackSrc={'/image-failed-to-load-big.svg'}
              className={
                'm-auto h-auto max-h-full w-auto min-w-40 max-w-full object-contain'
              }
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
  );
};

export default ImagesViewer;

type UsePrevNextButtonsType = {
  selectedImageIndex: number;
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
  startIndex: number,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] =
    useState<number>(startIndex);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollPrev();
    setSelectedImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollNext();
    setSelectedImageIndex(emblaApi.selectedScrollSnap());
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
    selectedImageIndex,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};
