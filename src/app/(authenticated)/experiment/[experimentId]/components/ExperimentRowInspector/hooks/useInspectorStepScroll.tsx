import { useEffect, useRef } from 'react';
import { StepMetadataColumn } from '../../../types';
import { RAW_DATA_SECTION } from '../ExperimentRowInspectorView';

export const useInspectorStepScroll = (
  stepMetadataColumns: StepMetadataColumn[],
) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const handleStepSelected = (stepColumnField: string) => {
    const section = document.getElementById(stepColumnField);
    if (section && bodyRef.current) {
      section.scrollIntoView();
    }
  };

  useEffect(() => {
    const bodyElement = bodyRef.current;
    if (!bodyElement) {
      return;
    }

    const handleScroll = () => {
      let currentSectionInView = RAW_DATA_SECTION;
      const bodyRect = bodyElement.getBoundingClientRect();

      [{ field: RAW_DATA_SECTION }, ...stepMetadataColumns].forEach(
        (column) => {
          const section = document.getElementById(column.field);
          if (section) {
            const sectionRect = section.getBoundingClientRect();
            const relativeTargetTop = sectionRect.top - bodyRect.top;
            if (relativeTargetTop <= 0) {
              currentSectionInView = section.id;
            }
          }
        },
      );

      [{ field: RAW_DATA_SECTION }, ...stepMetadataColumns].forEach(
        (column) => {
          const button = document.querySelector(
            `button[data-step-field="${column.field}"]`,
          );
          if (button) {
            if (column.field === currentSectionInView) {
              button.classList.add('bg-accent');
            } else {
              button.classList.remove('bg-accent');
            }
          }
        },
      );
    };
    bodyElement.addEventListener('scroll', handleScroll);

    return () => {
      bodyElement.removeEventListener('scroll', handleScroll);
    };
  }, [stepMetadataColumns, headerRef, bodyRef]);

  return {
    bodyRef,
    headerRef,
    handleStepSelected,
  };
};
