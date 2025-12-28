import { useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { updateElementSize, updateElementPosition } from '../../store';
import { selectCurrentSlideId } from '../../store';

export type ResizeDirection =
  | 'top-left' | 'top' | 'top-right'
  | 'left' | 'right'
  | 'bottom-left' | 'bottom' | 'bottom-right';

type UseResizeProps = {
  elementId: string;
  startWidth: number;
  startHeight: number;
  startX: number;
  startY: number;
  elementType: 'text' | 'image';
  disabled?: boolean;
  onFinish?: (width: number, height: number, x: number, y: number) => void;
}

function useResize(props: UseResizeProps) {
  const dispatch = useAppDispatch();
  const currentSlideId = useAppSelector(selectCurrentSlideId);

  const [isResizing, setIsResizing] = useState(false);
  const [, setForceUpdate] = useState(false);

  const sizeStateRef = useRef({
    width: props.startWidth,
    height: props.startHeight,
    x: props.startX,
    y: props.startY
  });

  const startDataRef = useRef({
    width: props.startWidth,
    height: props.startHeight,
    x: props.startX,
    y: props.startY,
    right: props.startX + props.startWidth,
    bottom: props.startY + props.startHeight
  });

  const startMouseRef = useRef({ x: 0, y: 0 });
  const lastUpdateRef = useRef<number>(0);
  const updateThreshold = 16;

  const updateCurrentSize = useCallback((newWidth: number, newHeight: number, newX: number, newY: number) => {
    sizeStateRef.current = { width: newWidth, height: newHeight, x: newX, y: newY };
    setForceUpdate(prev => !prev);
  }, []);

  const onResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    if (props.disabled) {
      e.stopPropagation();
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (currentSlideId.length == 0) return;

    setIsResizing(true);

    startDataRef.current = {
      width: props.startWidth,
      height: props.startHeight,
      x: props.startX,
      y: props.startY,
      right: props.startX + props.startWidth,
      bottom: props.startY + props.startHeight
    };

    sizeStateRef.current = {
      width: props.startWidth,
      height: props.startHeight,
      x: props.startX,
      y: props.startY
    };

    startMouseRef.current = { x: e.clientX, y: e.clientY };
    lastUpdateRef.current = Date.now();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < updateThreshold) {
        return;
      }
      lastUpdateRef.current = now;

      const deltaX = moveEvent.clientX - startMouseRef.current.x;
      const deltaY = moveEvent.clientY - startMouseRef.current.y;

      const MIN_SIZE = 30;
      const SNAP_THRESHOLD = 5;

      let newWidth = startDataRef.current.width;
      let newHeight = startDataRef.current.height;
      let newX = startDataRef.current.x;
      let newY = startDataRef.current.y;

      switch (direction) {
        case 'top-left':
          newWidth = Math.max(MIN_SIZE, startDataRef.current.width - deltaX);
          newHeight = Math.max(MIN_SIZE, startDataRef.current.height - deltaY);

          const actualDeltaX = startDataRef.current.width - newWidth;
          const actualDeltaY = startDataRef.current.height - newHeight;

          newX = startDataRef.current.x + actualDeltaX;
          newY = startDataRef.current.y + actualDeltaY;
          break;

        case 'top':
          newHeight = Math.max(MIN_SIZE, startDataRef.current.height - deltaY);
          const actualDeltaYTop = startDataRef.current.height - newHeight;
          newY = startDataRef.current.y + actualDeltaYTop;
          break;

        case 'top-right':
          newWidth = Math.max(MIN_SIZE, startDataRef.current.width + deltaX);
          newHeight = Math.max(MIN_SIZE, startDataRef.current.height - deltaY);
          const actualDeltaYTR = startDataRef.current.height - newHeight;
          newY = startDataRef.current.y + actualDeltaYTR;
          break;

        case 'left':
          newWidth = Math.max(MIN_SIZE, startDataRef.current.width - deltaX);
          const actualDeltaXLeft = startDataRef.current.width - newWidth;
          newX = startDataRef.current.x + actualDeltaXLeft;
          break;

        case 'right':
          newWidth = Math.max(MIN_SIZE, startDataRef.current.width + deltaX);
          break;

        case 'bottom-left':
          newWidth = Math.max(MIN_SIZE, startDataRef.current.width - deltaX);
          newHeight = Math.max(MIN_SIZE, startDataRef.current.height + deltaY);
          const actualDeltaXBL = startDataRef.current.width - newWidth;
          newX = startDataRef.current.x + actualDeltaXBL;
          break;

        case 'bottom':
          newHeight = Math.max(MIN_SIZE, startDataRef.current.height + deltaY);
          break;

        case 'bottom-right':
          newWidth = Math.max(MIN_SIZE, startDataRef.current.width + deltaX);
          newHeight = Math.max(MIN_SIZE, startDataRef.current.height + deltaY);
          break;
      }

      if (Math.abs(newWidth - startDataRef.current.width) < SNAP_THRESHOLD) {
        newWidth = startDataRef.current.width;
        if (direction.includes('left')) {
          newX = startDataRef.current.x;
        }
      }

      if (Math.abs(newHeight - startDataRef.current.height) < SNAP_THRESHOLD) {
        newHeight = startDataRef.current.height;
        if (direction.includes('top')) {
          newY = startDataRef.current.y;
        }
      }

      updateCurrentSize(newWidth, newHeight, newX, newY);
    };
    const handleMouseUp = () => {
      setIsResizing(false);

      const finalWidth = sizeStateRef.current.width;
      const finalHeight = sizeStateRef.current.height;
      const finalX = sizeStateRef.current.x;
      const finalY = sizeStateRef.current.y;

      if (currentSlideId.length > 0) {
        dispatch(updateElementSize({
          slideId: currentSlideId,
          elementId: props.elementId,
          newSize: { width: finalWidth, height: finalHeight }
        }));

        if (finalX !== startDataRef.current.x || finalY !== startDataRef.current.y) {
          console.log(props.elementId);
          dispatch(updateElementPosition({
            slideId: currentSlideId,
            elementId: props.elementId,
            newPosition: { x: finalX, y: finalY }
          }));
        }
      }

      props.onFinish?.(finalWidth, finalHeight, finalX, finalY);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [props.elementId, props.disabled, props.onFinish, props.startWidth, props.startHeight, props.startX, props.startY, updateCurrentSize, dispatch, currentSlideId]);

  return {
    isResizing,
    width: sizeStateRef.current.width,
    height: sizeStateRef.current.height,
    position: { x: sizeStateRef.current.x, y: sizeStateRef.current.y },
    onResizeStart,
  };
};

export { useResize };