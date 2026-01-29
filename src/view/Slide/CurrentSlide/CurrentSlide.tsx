import { useCallback } from 'react';
import type { SlideElement } from '../../../types/presentationTypes';
import { TextElementObject } from '../СomponentsSlide/TextElement/TextElementObject';
import { ImageElementObject } from '../СomponentsSlide/ImageElement/ImageElementObject';
import { renderSlideBackground } from '../BackroundSlide';
import { SelectionContainer } from '../СomponentsSlide/SelectionContainer/SelectionContainer';
import styles from "./currentSlide.module.css";
import { useAppSelector } from '../../../utils/hooks/redux';
import { useMultipleSelection } from '../../../utils/hooks/useMultipleSelection';
import { useMultipleDrag } from '../../../utils/hooks/useMultipleDrag';
import { selectCurrentSlide, selectSelectedElementIds } from '../../../store';

type CurrentSlideProps = {
  onElementClick: (element: SlideElement) => void;
};

function CurrentSlide(props: CurrentSlideProps) {
  const currentSlide = useAppSelector(selectCurrentSlide);
  const selectedElementIds = useAppSelector(selectSelectedElementIds);
  
  if (!currentSlide?.id) {
    return (
      <div className={styles.currentSlide}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p>Нет выбранного слайда</p>
        </div>
      </div>
    );
  }

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
    isDragging: isGroupDragging,
    dragDelta,
    startDrag,
    updateDrag,
    endDrag,
    getSelectedElementsInfo,
  } = useMultipleDrag();

  const hasGroupSelection = selectedElementIds.length > 1;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target === e.currentTarget) {
      clearSelection();
      startSelection(e.clientX, e.clientY);
    }
  }, [startSelection, clearSelection]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isSelecting) {
      updateSelection(e.clientX, e.clientY);
    }
    if (isGroupDragging) {
      updateDrag(e.clientX, e.clientY);
    }
  }, [isSelecting, updateSelection, isGroupDragging, updateDrag]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      endSelection();
    }
    if (isGroupDragging) {
      endDrag();
    }
  }, [isSelecting, endSelection, isGroupDragging, endDrag]);

  const handleMouseLeave = useCallback(() => {
    if (isSelecting) {
      endSelection();
    }
    if (isGroupDragging) {
      endDrag();
    }
  }, [isSelecting, endSelection, isGroupDragging, endDrag]);

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

  const selectedElementsInfo = getSelectedElementsInfo();

  return (
    <div
      ref={slideContainerRef}
      className={styles.currentSlide}
      style={renderSlideBackground(currentSlide.background)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {currentSlide.elements.map((element: SlideElement) => {
        const isSelected = selectedElementIds.includes(element.id);
        const isInGroup = hasGroupSelection && isSelected;

        return element.type === "text" ? (
          <TextElementObject
            key={element.id}
            element={element}
            onClick={props.onElementClick}
            isSelected={isSelected}
            isInGroup={isInGroup}
            dragDelta={dragDelta}
            isGroupDragging={isGroupDragging && isSelected}
            onDragStart={isSelected && !isInGroup ? startDrag : undefined}
            onDrag={isSelected && !isInGroup ? updateDrag : undefined}
            onDragEnd={isSelected && !isInGroup ? endDrag : undefined}
          />
        ) : (
          <ImageElementObject
            key={element.id}
            element={element}
            onClick={props.onElementClick}
            isSelected={isSelected}
            isInGroup={isInGroup}
            dragDelta={dragDelta}
            isGroupDragging={isGroupDragging && isSelected}
            onDragStart={isSelected && !isInGroup ? startDrag : undefined}
            onDrag={isSelected && !isInGroup ? updateDrag : undefined}
            onDragEnd={isSelected && !isInGroup ? endDrag : undefined}
          />
        );
      })}

      {selectedElementsInfo.length > 1 && (
        <SelectionContainer
          selectedElements={selectedElementsInfo}
          dragDelta={dragDelta}
          isDragging={isGroupDragging}
          onMouseDown={(e) => {
            startDrag(e.clientX, e.clientY);
            e.stopPropagation();
          }}
        />
      )}

      {isSelecting && selectionRect && (
        <div style={selectionStyle} />
      )}
    </div>
  );
}

export { CurrentSlide };