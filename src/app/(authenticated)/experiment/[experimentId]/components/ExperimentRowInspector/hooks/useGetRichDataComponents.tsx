import RichDataParser, {
  urlHeadRequestCache,
} from '@/lib/services/RichDataParser';
import { SupportedFormat } from '@/lib/services/RichDataParser/constants';
import { CurrentView } from '@/lib/services/RichDataParser/types';
import React, { useMemo } from 'react';
import useSWR from 'swr';
import { ImageWithFallback } from './ImageWithFallback';

export const useGetRichDataComponents = (
  data: string,
  setCurrentViewContent: (currentViewContent: CurrentView) => void,
): JSX.Element[] => {
  const { data: urls = [], isLoading } = useSWR(data, RichDataParser.parseData);

  const viewImage = (images: string[], clickedImageIndex: number) => {
    if (!images.length) {
      return;
    }
    const contextImages: CurrentView = {
      content: images,
      type: SupportedFormat.IMAGE,
      startIndex: clickedImageIndex,
    };
    setCurrentViewContent(contextImages);
  };

  const viewPDF = (PDF: string) => {
    if (!PDF) {
      return;
    }
    const contextPDF: CurrentView = {
      content: PDF,
      type: SupportedFormat.PDF,
    };
    setCurrentViewContent(contextPDF);
  };

  const richDataComponents = useMemo(() => {
    if (isLoading) {
      return [];
    }
    // Used to show components grouped and in the right order
    const components = {
      [SupportedFormat.IMAGE]: [] as JSX.Element[],
      [SupportedFormat.PDF]: [] as JSX.Element[],
    };
    // Used for viewImages
    const imageTypeUrls: string[] = [];

    urls.forEach((url, index) => {
      const format = urlHeadRequestCache[url];
      if (!format || format === SupportedFormat.MARKDOWN) {
        return;
      }

      if (format === SupportedFormat.IMAGE) {
        imageTypeUrls.push(url);
      }

      const component =
        format === SupportedFormat.IMAGE ? (
          <div
            className="flex h-[100px] w-[100px] cursor-pointer items-center justify-center bg-gridHeaderColor"
            key={index}
            onClick={() => viewImage(imageTypeUrls, imageTypeUrls.indexOf(url))}
          >
            <ImageWithFallback
              src={url}
              alt={url}
              width={1000}
              height={1000}
              fallbackSrc={'/image-failed-to-load.svg'}
              className="h-auto max-h-full w-auto min-w-6 max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1" key={index}>
            <a
              href={url}
              target="_blank"
              className="mb-2 break-all text-primary hover:underline"
            >
              {url}
            </a>
            <span
              className="w-fit cursor-pointer rounded-sm bg-secondary px-2 py-1 text-primary"
              onClick={() => viewPDF(url)}
            >
              View PDF
            </span>
          </div>
        );

      components[format].push(component);
    });

    return Object.entries(components).map(([format, componentArray]) =>
      componentArray.length ? (
        <div key={format} className="mb-4 flex flex-col gap-2">
          <span
            className={
              'w-fit rounded-2xl border-[thin] border-borderActive px-2 text-borderActive'
            }
          >
            {format === SupportedFormat.IMAGE ? 'image(s)' : 'pdf(s)'}
          </span>
          <div
            className={`flex ${format === SupportedFormat.IMAGE ? 'gap-2' : ''}`}
          >
            {componentArray}
          </div>
        </div>
      ) : (
        <React.Fragment key={format}></React.Fragment>
      ),
    );
  }, [isLoading, urls]);

  return richDataComponents;
};
