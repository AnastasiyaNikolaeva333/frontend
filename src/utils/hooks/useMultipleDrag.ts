import { useState, useRef, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { updateMultipleElementPositions } from '../../store';
import { selectSlides, selectCurrentSlideId, selectSelectedElementIds } from '../../store';
import type { Position, Size } from '../../types/presentationTypes';

export function useMultipleDrag() {
  const dispatch = useAppDispatch();
  const selectedElementIds = useAppSelector(selectSelectedElementIds);
  const currentSlideId = useAppSelector(selectCurrentSlideId);
  const slides = useAppSelector(selectSlides);

  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const startPositionsRef = useRef<{ [elementId: string]: Position }>({});
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const isMultipleRef = useRef(false); 

  const currentSlide = slides.find(slide => slide.id === currentSlideId[0]);

  const startDrag = useCallback((startX: number, startY: number) => {
    
    if (selectedElementIds.length < 2 || !currentSlide) return;
    
    isMultipleRef.current = selectedElementIds.length > 1;
    
    startPositionsRef.current = {};
    selectedElementIds.forEach(elementId => {
      const element = currentSlide.elements.find(el => el.id === elementId);
      if (element) {
        startPositionsRef.current[elementId] = { ...element.position };
      }
    });

    dragStartRef.current = { x: startX, y: startY };
    setDragDelta({ x: 0, y: 0 });
    setIsDragging(true);
    hasMovedRef.current = false;
  }, [selectedElementIds, currentSlide]);

  const updateDrag = useCallback((currentX: number, currentY: number) => {
    if (!isDragging || !isMultipleRef.current) return;

    const deltaX = currentX - dragStartRef.current.x;
    const deltaY = currentY - dragStartRef.current.y;
    
    const hasMoved = Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1;
    
    if (hasMoved) {
      setDragDelta({ x: deltaX, y: deltaY });
      hasMovedRef.current = true;
    }
  }, [isDragging]);

  const endDrag = useCallback(() => {
    if (isDragging && currentSlideId && 
        Object.keys(startPositionsRef.current).length > 1 && 
        hasMovedRef.current &&
        isMultipleRef.current) {

      const updates = Object.entries(startPositionsRef.current)
        .filter(([elementId]) => selectedElementIds.includes(elementId))
        .map(([elementId, startPos]) => {
          const newPosition = {
            x: startPos.x + dragDelta.x,
            y: startPos.y + dragDelta.y  
          };

          return {
            slideId: currentSlideId,
            elementId: elementId,
            newPosition: newPosition
          };
        });

      if (updates.length > 1) {
        dispatch(updateMultipleElementPositions(updates));
      }
    }

    setIsDragging(false);
    setDragDelta({ x: 0, y: 0 });
    startPositionsRef.current = {};
    hasMovedRef.current = false;
    isMultipleRef.current = false;
  }, [isDragging, currentSlideId, dragDelta, dispatch, selectedElementIds]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateDrag(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        endDrag();
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateDrag, endDrag]);

  const getSelectedElementsInfo = useCallback((): Array<{
    id: string;
    position: Position;
    sizes: Size;
  }> => {
    if (!currentSlide) return [];

    return selectedElementIds
      .map(elementId => {
        const element = currentSlide.elements.find(el => el.id === elementId);
        return element ? {
          id: element.id,
          position: element.position,
          sizes: element.sizes
        } : null;
      })
      .filter((el): el is NonNullable<typeof el> => el !== null);
  }, [selectedElementIds, currentSlide]);

  return {
    isDragging,
    dragDelta,
    startDrag,
    updateDrag,
    endDrag,
    getSelectedElementsInfo
  };
}