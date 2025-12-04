import { useState, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from './redux';
import { selectElements } from '../../store/action-creators'; 


export function useMultipleSelection() {
  const dispatch = useAppDispatch();
  const selectedElementIds = useAppSelector(state => 
    Array.from(state.selected.selectedElementIds)
  );
  const currentSlideId = useAppSelector(state => state.selected.currentSlideId);
  const slides = useAppSelector(state => state.slides);
  
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const currentSlide = slides.find(slide => slide.id === currentSlideId);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const getSlidePosition = useCallback(() => {
    if (!slideContainerRef.current) return { left: 0, top: 0 };
    const rect = slideContainerRef.current.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
  }, []);

  const getRelativeCoordinates = useCallback((clientX: number, clientY: number) => {
    const slidePos = getSlidePosition();
    return {
      x: clientX - slidePos.left,
      y: clientY - slidePos.top
    };
  }, [getSlidePosition]);

  const selectElementsInRect = useCallback((startX: number, startY: number, currentX: number, currentY: number) => {
    if (!currentSlide) return;

    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const right = Math.max(startX, currentX);
    const bottom = Math.max(startY, currentY);

    const elementsInRect = currentSlide.elements.filter(element => {
      const elementLeft = element.position.x;
      const elementTop = element.position.y;
      const elementRight = element.position.x + element.sizes.width;
      const elementBottom = element.position.y + element.sizes.height;

      return !(elementRight < left || 
               elementLeft > right || 
               elementBottom < top || 
               elementTop > bottom);
    });

    dispatch(selectElements(elementsInRect.map(el => el.id)));
  }, [currentSlide, dispatch]);

  const startSelection = useCallback((clientX: number, clientY: number) => {
    const relativePos = getRelativeCoordinates(clientX, clientY);
    setIsSelecting(true);
    setSelectionRect({
      startX: relativePos.x,
      startY: relativePos.y,
      currentX: relativePos.x,
      currentY: relativePos.y
    });
  }, [getRelativeCoordinates]);

  const updateSelection = useCallback((clientX: number, clientY: number) => {
    if (!isSelecting || !selectionRect) return;

    const relativePos = getRelativeCoordinates(clientX, clientY);
    
    setSelectionRect(prev => prev ? {
      ...prev,
      currentX: relativePos.x,
      currentY: relativePos.y
    } : null);

    selectElementsInRect(
      selectionRect.startX, 
      selectionRect.startY, 
      relativePos.x, 
      relativePos.y
    );
  }, [isSelecting, selectionRect, getRelativeCoordinates, selectElementsInRect]);

  const endSelection = useCallback(() => {
    setIsSelecting(false);
    setSelectionRect(null);
  }, []);

  const clearSelection = useCallback(() => {
    dispatch(selectElements([]));
  }, [dispatch]);

  return {
    selectedElementIds,
    isSelecting,
    selectionRect,
    startSelection,
    updateSelection,
    endSelection,
    clearSelection,
    slideContainerRef
  };
}