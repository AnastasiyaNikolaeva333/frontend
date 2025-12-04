import { useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { updateElementSize } from '../../store/action-creators';

export type ResizeDirection = 
  | 'top-left' | 'top' | 'top-right' 
  | 'left' | 'right' 
  | 'bottom-left' | 'bottom' | 'bottom-right';

type UseResizeProps = {
  elementId: string;
  startWidth: number;
  startHeight: number;
  elementType: 'text' | 'image';
  onFinish?: (width: number, height: number) => void;
}

function useResize(props: UseResizeProps) {
  const dispatch = useAppDispatch();
  const currentSlideId = useAppSelector((state) => state.selected.currentSlideId);
  
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(props.startWidth);
  const [height, setHeight] = useState(props.startHeight);

  const startSizeRef = useRef({ width: 0, height: 0 });
  const startPositionRef = useRef({ x: 0, y: 0 });
  const currentSizeRef = useRef({ width: props.startWidth, height: props.startHeight });
  const lastUpdateRef = useRef<number>(0);
  const updateThreshold = 16;

  const updateCurrentSize = useCallback((newWidth: number, newHeight: number) => {
    setWidth(newWidth);
    setHeight(newHeight);
    currentSizeRef.current = { width: newWidth, height: newHeight };
  }, []);

  const onResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentSlideId) return;

    setIsResizing(true);
    startSizeRef.current = {
      width: currentSizeRef.current.width,
      height: currentSizeRef.current.height
    };
    startPositionRef.current = { x: e.clientX, y: e.clientY };
    lastUpdateRef.current = Date.now();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < updateThreshold) {
        return;
      }
      lastUpdateRef.current = now;

      const deltaX = moveEvent.clientX - startPositionRef.current.x;
      const deltaY = moveEvent.clientY - startPositionRef.current.y;

      let newWidth = startSizeRef.current.width;
      let newHeight = startSizeRef.current.height;

      const MIN_SIZE = 30;
      const SNAP_THRESHOLD = 5;

      switch (direction) {
        case 'top-left':
          newWidth = Math.max(MIN_SIZE, startSizeRef.current.width - deltaX);
          newHeight = Math.max(MIN_SIZE, startSizeRef.current.height - deltaY);
          break;
        case 'top':
          newHeight = Math.max(MIN_SIZE, startSizeRef.current.height - deltaY);
          break;
        case 'top-right':
          newWidth = Math.max(MIN_SIZE, startSizeRef.current.width + deltaX);
          newHeight = Math.max(MIN_SIZE, startSizeRef.current.height - deltaY);
          break;
        case 'left':
          newWidth = Math.max(MIN_SIZE, startSizeRef.current.width - deltaX);
          break;
        case 'right':
          newWidth = Math.max(MIN_SIZE, startSizeRef.current.width + deltaX);
          break;
        case 'bottom-left':
          newWidth = Math.max(MIN_SIZE, startSizeRef.current.width - deltaX);
          newHeight = Math.max(MIN_SIZE, startSizeRef.current.height + deltaY);
          break;
        case 'bottom':
          newHeight = Math.max(MIN_SIZE, startSizeRef.current.height + deltaY);
          break;
        case 'bottom-right':
          newWidth = Math.max(MIN_SIZE, startSizeRef.current.width + deltaX);
          newHeight = Math.max(MIN_SIZE, startSizeRef.current.height + deltaY);
          break;
      }

      if (Math.abs(newWidth - startSizeRef.current.width) < SNAP_THRESHOLD) {
        newWidth = startSizeRef.current.width;
      }
      if (Math.abs(newHeight - startSizeRef.current.height) < SNAP_THRESHOLD) {
        newHeight = startSizeRef.current.height;
      }

      updateCurrentSize(newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);

      const finalWidth = currentSizeRef.current.width;
      const finalHeight = currentSizeRef.current.height;

      dispatch(updateElementSize(
        currentSlideId,
        props.elementId, 
        { width: finalWidth, height: finalHeight }
      ));

      props.onFinish?.(finalWidth, finalHeight);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [props.elementId, props.elementType, props.onFinish, updateCurrentSize, dispatch, currentSlideId]);

  return {
    isResizing,
    width,
    height,
    onResizeStart,
  };
};

export { useResize }