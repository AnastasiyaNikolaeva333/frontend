import { useState, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from './redux';
import { updateElementPosition } from '../../store/action-creators'; 
import type { Position } from '../../types/presentationTypes'; 
//отладить работу переменения нескольких слайдов


export function useMultipleDrag() {
  const dispatch = useAppDispatch();
  const selectedElementIds = useAppSelector(state => 
    Array.from(state.selected.selectedElementIds)
  );
  const currentSlideId = useAppSelector(state => state.selected.currentSlideId);
  const slides = useAppSelector(state => state.slides);
  
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<{ [elementId: string]: Position }>({});
  const initialPositionsRef = useRef<{ [elementId: string]: Position }>({});

  const currentSlide = slides.find(slide => slide.id === currentSlideId);

  const startDrag = useCallback((startX: number, startY: number) => {
    if (selectedElementIds.length === 0 || !currentSlide) return;

    selectedElementIds.forEach(elementId => {
      const element = currentSlide.elements.find(el => el.id === elementId);
      if (element) {
        initialPositionsRef.current[elementId] = { ...element.position };
        dragOffsetRef.current[elementId] = {
          x: startX - element.position.x,
          y: startY - element.position.y
        };
      }
    });

    setIsDragging(true);
  }, [selectedElementIds, currentSlide]);

  const updateDrag = useCallback((currentX: number, currentY: number) => {
    if (!isDragging || !currentSlideId || Object.keys(dragOffsetRef.current).length === 0) return;

    selectedElementIds.forEach(elementId => {
      const offset = dragOffsetRef.current[elementId];
      const initialPos = initialPositionsRef.current[elementId];
      
      if (offset && initialPos) {
        const newPosition = {
          x: Math.max(0, currentX - offset.x),
          y: Math.max(0, currentY - offset.y)
        };

        if (newPosition.x !== initialPos.x || newPosition.y !== initialPos.y) {
          dispatch(updateElementPosition(
            currentSlideId,
            elementId,
            newPosition
          ));
        }
      }
    });
  }, [isDragging, selectedElementIds, currentSlideId, dispatch]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    dragOffsetRef.current = {};
    initialPositionsRef.current = {};
  }, []);

  return {
    isDragging,
    startDrag,
    updateDrag,
    endDrag
  };
}