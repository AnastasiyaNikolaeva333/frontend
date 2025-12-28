import { useDispatch } from 'react-redux';
import { selectElements, selectSlide} from '../../../store'; 
import type { SlideElement } from '../../../types/presentationTypes';
import { useAppSelector } from '../../../utils/hooks/redux';

function useSelection(element: SlideElement) {
  const dispatch = useDispatch();
  const currentSlide = useAppSelector((state) => state.selection.currentSlideId);
  const selectedElementIds = useAppSelector((state) => state.selection.selectedElementIds);

  const handleElementClick = () => {
    if (currentSlide.length > 1) dispatch(selectSlide([currentSlide[0]]));
    if (!selectedElementIds.includes(element.id)) dispatch(selectElements([element.id]));
  };

  const isActive = selectedElementIds.includes(element.id); 

  return {
    handleElementClick,
    isActive,
  };
}

export { useSelection };