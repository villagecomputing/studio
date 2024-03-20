import { ARROW_DOWN, ARROW_UP, ENTER, ESCAPE } from '@/lib/constants';
import { useEffect, useRef } from 'react';
import { BaseRowInspectorProps } from './type';

export const BaseRowInspector: React.FC<BaseRowInspectorProps> = (props) => {
  const { open, children, onNavigate, onEnter, onEscape } = props;

  const onEnterRef = useRef(onEnter);
  const onEscapeRef = useRef(onEscape);
  const onNavigateRef = useRef(onNavigate);

  useEffect(() => {
    onEscapeRef.current = onEscape;
    onEnterRef.current = onEnter;
    onNavigateRef.current = onNavigate;
  }, [onEnter, onNavigate, onEscape]);

  const handleKeyDown = async (event: KeyboardEvent) => {
    switch (event.key) {
      case ESCAPE:
        onEscapeRef.current();
        return;
      case ENTER:
        onEnterRef.current();
        return;
      case ARROW_UP:
        onNavigateRef.current('PREVIOUS');
        return;
      case ARROW_DOWN:
        onNavigateRef.current('NEXT');
        return;
      default:
        return;
    }
  };

  // Add event listener on mount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`row-inspector-view absolute bottom-0 right-0 top-0 z-inspectorView flex w-full max-w-inspectorView translate-x-full flex-col bg-white ${open ? 'row-inspector-view-active' : ''}`}
    >
      {children}
    </div>
  );
};
