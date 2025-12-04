import React, { useCallback } from 'react';
import type { SlideElement } from '../../../types/presentationTypes'; 
import { TextElementObject } from '../СomponentsSlide/TextElementObject'; 
import { ImageElementObject } from '../СomponentsSlide/ImageElementObject'; 
import { renderSlideBackground } from '../BackroundSlide'; 
import styles from "./currentSlide.module.css";
import { useAppSelector } from '../../../hooks'; 
import { useMultipleSelection } from '../../../utils/hooks/useMultipleSelection'; 
import { useMultipleDrag } from '../../../utils/hooks/useMultipleDrag'; 

type CurrentSlideProps = {
  onElementClick: (element: SlideElement) => void;
};

function CurrentSlide(props: CurrentSlideProps) {
  const slides = useAppSelector((state) => state.slides);
  const selected = useAppSelector((state) => state.selected);
  
  const {
    isSelecting,
    selectionRect,
    startSelection,
    updateSelection,
    endSelection,
    clearSelection,
    slideContainerRef
  } = useMultipleSelection();

  const {
    isDragging,
    startDrag,
    updateDrag,
    endDrag
  } = useMultipleDrag();

  const currentSlide = slides.find(slide => slide.id === selected.currentSlideId) || slides[0];

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
      startSelection(e.clientX, e.clientY);
    }
  }, [clearSelection, startSelection]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isSelecting) {
      updateSelection(e.clientX, e.clientY);
    }
  }, [isSelecting, updateSelection]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      endSelection();
    }
    if (isDragging) {
      endDrag();
    }
  }, [isSelecting, endSelection, isDragging, endDrag]);

  const selectionStyle: React.CSSProperties = selectionRect ? {
    position: 'absolute',
    left: Math.min(selectionRect.startX, selectionRect.currentX),
    top: Math.min(selectionRect.startY, selectionRect.currentY),
    width: Math.abs(selectionRect.currentX - selectionRect.startX),
    height: Math.abs(selectionRect.currentY - selectionRect.startY),
    border: '2px dashed #1a73e8',
    backgroundColor: 'rgba(26, 115, 232, 0.1)',
    pointerEvents: 'none',
    zIndex: 1000
  } : {};

  return (
    <div 
      ref={slideContainerRef}
      className={styles.currentSlide} 
      style={renderSlideBackground(currentSlide.background)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {currentSlide.elements.map((element) =>
        element.type === "text" ? (
          <TextElementObject
            key={element.id}
            element={element}
            onClick={props.onElementClick}
            onDragStart={startDrag}
            onDrag={updateDrag}
            onDragEnd={endDrag}
          />
        ) : (
          <ImageElementObject
            key={element.id}
            element={element}
            onClick={props.onElementClick}
            onDragStart={startDrag}
            onDrag={updateDrag}
            onDragEnd={endDrag}
          />
        )
      )}
      
      {isSelecting && selectionRect && (
        <div style={selectionStyle} />
      )}
    </div>
  );
}

export { CurrentSlide };