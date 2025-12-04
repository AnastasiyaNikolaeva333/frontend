import { useAppSelector, useAppDispatch } from '../../utils/hooks/redux';
import { addSlide, removeSlide, addElement, selectElements, removeElements, selectSlide } from '../../store/action-creators/';
import { createImageElement, createTextElement, createNewSlide } from '../function/functionCreateElements';
import { useBackgroundActions } from './functionBackround';

export function useToolbarActions() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.selected);
  const slides = useAppSelector((state) => state.slides);
  const { handleChangeBackground } = useBackgroundActions();

  const handleToolbarAction = (action: string) => {
    
    switch (action) {
      case "add-slide":
        const newSlide = createNewSlide();
        dispatch(addSlide(newSlide, selected.currentSlideId));
        dispatch(selectSlide(newSlide.id));
        break;
      case "remove-slide":
        if (selected.currentSlideId) {
          const currentIndex = slides.findIndex(slide => slide.id === selected.currentSlideId);
          
          dispatch(removeSlide(selected.currentSlideId));

          if (slides.length > 1) {
            let newSelectedSlideId: string;
            
            if (currentIndex === slides.length - 1) {
              newSelectedSlideId = slides[currentIndex - 1].id;
            } else {
              newSelectedSlideId = slides[currentIndex + 1].id;
            }
            
            dispatch(selectSlide(newSelectedSlideId));
          }
        }
        break;
      case "add-text":
        const elementText = createTextElement();
        if (selected.currentSlideId) {
          dispatch(addElement(selected.currentSlideId, elementText));
          dispatch(selectElements([elementText.id]));
        }
        break;
      case "add-image":
        createImageElement().then((elementImage) => {
          if (selected.currentSlideId) {
            dispatch(addElement(selected.currentSlideId, elementImage));
            dispatch(selectElements([elementImage.id]));
          }
        });
        break;
      case "change-background":
        handleChangeBackground();
        break;
      case "remove-element":
        if (selected.selectedElementIds.size > 0 && selected.currentSlideId) {
          const elementIdsArray = Array.from(selected.selectedElementIds);
          dispatch(removeElements(selected.currentSlideId, elementIdsArray));
        }
        break;
      default:
        console.log("❓ Unknown action:", action);
    }
  };

  return handleToolbarAction;
}