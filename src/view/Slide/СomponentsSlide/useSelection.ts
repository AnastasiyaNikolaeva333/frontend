import { useDispatch } from 'react-redux';
import { selectElements } from '../../../store/action-creators/elements';
import type { SlideElement } from '../../../types/presentationTypes';
import { useAppSelector } from '../../../utils/hooks/redux';

function useSelection(element: SlideElement) {
  const dispatch = useDispatch();
  const selectedElementIds = useAppSelector((state) => state.selected.selectedElementIds);

  const handleElementClick = () => {
    dispatch(selectElements([element.id]));
  };

  const isActive = selectedElementIds.has(element.id); 

  return {
    handleElementClick,
    isActive,
  };
}

export { useSelection };