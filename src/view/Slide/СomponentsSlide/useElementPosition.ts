import { useDispatch } from 'react-redux';
import { selectElements, updateElementPosition } from '../../../store/action-creators/elements';
import type { SlideElement } from '../../../types/presentationTypes';
import { useDnd } from '../../../utils/hooks/useDnd';
import { useAppSelector } from '../../../utils/hooks/redux';

function useElementPosition(element: SlideElement) {
  const dispatch = useDispatch();
  const slides = useAppSelector((state) => state.slides);

  const startX = element.position.x;
  const startY = element.position.y;

  const currentSlide = slides.find(slide =>
    slide.elements.some(el => el.id === element.id)
  );

  const {
    isDragging,
    top,
    left,
    onMouseDown
  } = useDnd({
    startX,
    startY,
    onDrag: () => { },
    onFinish: (newX: number, newY: number) => {
      if (currentSlide) {
        dispatch(updateElementPosition(
          currentSlide.id,      
          element.id,           
          { x: newX, y: newY }
        ));
        dispatch(selectElements([element.id]));
      }
    }
  });

  const getElementStyle = (): React.CSSProperties => ({
    position: "absolute",
    left: isDragging ? left : `${startX}px`,
    top: isDragging ? top : `${startY}px`,
    width: `${element.sizes.width}px`,
    height: `${element.sizes.height}px`,
    userSelect: isDragging ? 'none' : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
  });

  return {
    isDragging,
    elementStyle: getElementStyle(),
    onMouseDown,
  };
}

export { useElementPosition }