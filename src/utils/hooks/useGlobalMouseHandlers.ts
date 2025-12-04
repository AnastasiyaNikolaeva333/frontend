import { useEffect } from 'react';

export function useGlobalMouseHandlers(
  onMouseMove?: (e: MouseEvent) => void,
  onMouseUp?: (e: MouseEvent) => void,
  isActive: boolean = false
) {
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      onMouseMove?.(e);
    };

    const handleMouseUp = (e: MouseEvent) => {
      onMouseUp?.(e);
    };

    document.addEventListener('mousemove', handleMouseMove, { capture: true });
    document.addEventListener('mouseup', handleMouseUp, { capture: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, { capture: true });
      document.removeEventListener('mouseup', handleMouseUp, { capture: true });
    };
  }, [isActive, onMouseMove, onMouseUp]);
}