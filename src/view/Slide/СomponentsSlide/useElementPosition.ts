import { useDispatch } from 'react-redux';
import { selectSlide, updateElementPositions } from '../../../store';
import type { SlideElement } from '../../../types/presentationTypes';
import { useDnd } from '../../../utils/hooks/useDnd';
import { useAppSelector } from '../../../utils/hooks/redux';
import { selectSlides, selectCurrentSlideId } from '../../../store';

function useElementPosition(
  element: SlideElement,
  onDrag?: (x: number, y: number) => void,
  onDragEnd?: () => void
) {
  const dispatch = useDispatch();
  const slides = useAppSelector(selectSlides);
  const currentSlideId = useAppSelector(selectCurrentSlideId);

  const startX = element.position.x;
  const startY = element.position.y;

  const currentSlide = slides.find(slide => slide.id === currentSlideId[0]);
  const elementInCurrentSlide = currentSlide?.elements.find(el => el.id === element.id);

  const {
    isDragging,
    top,
    left,
    onMouseDown
  } = useDnd({
    startX,
    startY,
    onDrag: (newX: number, newY: number) => {
      const deltaX = newX - startX;
      const deltaY = newY - startY;

      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        onDrag?.(deltaX, deltaY);
      }
    },
    onFinish: (newX: number, newY: number) => {

      const deltaX = Math.abs(newX - startX);
      const deltaY = Math.abs(newY - startY);
      const hasMoved = deltaX > 1 || deltaY > 1;

      if (currentSlideId.length > 1) dispatch(selectSlide([currentSlideId[0]]));

      if (hasMoved && currentSlideId && elementInCurrentSlide) {
        dispatch(updateElementPositions([{
          slideId: currentSlideId,
          elementId: element.id,
          newPosition: { x: newX, y: newY }
        }]));
        onDragEnd?.();
      } else if (hasMoved) {
        onDragEnd?.();
      }
    }
  });

  const getElementStyle = (dragDelta?: { x: number; y: number }): React.CSSProperties => {
    if (isDragging) {
      return {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${element.sizes.width}px`,
        height: `${element.sizes.height}px`,
        userSelect: 'none',
        cursor: 'grabbing',
      };
    }

    if (dragDelta) {

      const actualDeltaX = Math.abs(dragDelta.x) > 1 ? dragDelta.x : 0;
      const actualDeltaY = Math.abs(dragDelta.y) > 1 ? dragDelta.y : 0;

      return {
        position: "absolute",
        left: `${startX + actualDeltaX}px`,
        top: `${startY + actualDeltaY}px`,
        width: `${element.sizes.width}px`,
        height: `${element.sizes.height}px`,
        userSelect: 'auto',
        cursor: 'default',
      };
    }

    return {
      position: "absolute",
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${element.sizes.width}px`,
      height: `${element.sizes.height}px`,
      userSelect: 'auto',
      cursor: 'grab',
    };
  };

  return {
    isDragging,
    elementStyle: getElementStyle,
    onMouseDown,
  };
}

export { useElementPosition };