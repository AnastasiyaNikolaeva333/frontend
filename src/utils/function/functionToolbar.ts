// utils/function/useToolbarActions.ts
import { useAppSelector, useAppDispatch } from '../../utils/hooks/redux';
import { addSlide, removeSlides, addElement, removeElements, clearSelection, selectElements } from '../../store';
import { selectSlide, selectSlides, selectCurrentSlideId, selectSelectedElementIds } from '../../store';
import { createImageElement, createTextElement, createNewSlide } from '../function/functionCreateElements';
import { useBackgroundActions } from './functionBackround';

export function useToolbarActions() {
  const dispatch = useAppDispatch();
  const currentSlideId = useAppSelector(selectCurrentSlideId);
  const selectedElementIds = useAppSelector(selectSelectedElementIds);
  const slides = useAppSelector(selectSlides);
  const { handleChangeBackground } = useBackgroundActions();

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case "add-slide":
        const newSlide = createNewSlide();
        dispatch(addSlide({ slide: newSlide, currentIndex: currentSlideId }));
        dispatch(selectSlide([newSlide.id]));
        break;
      case "remove-slides":
        if (currentSlideId.length > 0) {
          const slidesBeforeRemoval = [...slides];
          const currentSlide = slidesBeforeRemoval.find(slide => slide.id === currentSlideId[0]);
          
          if (!currentSlide) break;
          
          const currentIndex = slidesBeforeRemoval.findIndex(slide => slide.id === currentSlide.id);
          
          dispatch(removeSlides(currentSlideId));

          
          if (slidesBeforeRemoval.length > currentSlideId.length) {
            let newSelectedSlideId: string | null = null;
            
            if (currentIndex >= slidesBeforeRemoval.length - currentSlideId.length) {
              
              const newIndex = Math.max(0, slidesBeforeRemoval.length - currentSlideId.length - 1);
              if (slidesBeforeRemoval[newIndex]) {
                newSelectedSlideId = slidesBeforeRemoval[newIndex].id;
              }
            } else {
              const remainingSlides = slidesBeforeRemoval.filter(slide => !currentSlideId.includes(slide.id));
              if (currentIndex < remainingSlides.length) {
                newSelectedSlideId = remainingSlides[currentIndex].id;
              } else if (remainingSlides.length > 0) {
                newSelectedSlideId = remainingSlides[remainingSlides.length - 1].id;
              }
            }
            
            if (newSelectedSlideId) {
              dispatch(selectSlide([newSelectedSlideId]));
            }
          }
          else if (slidesBeforeRemoval.length === currentSlideId.length) {
            const newSlide = createNewSlide();
            dispatch(addSlide({ slide: newSlide, currentIndex: [] }));
            dispatch(selectSlide([newSlide.id]));
          }
        }
        break;
      case "add-text":
        const elementText = createTextElement();
        if (currentSlideId.length > 0) {
          dispatch(selectSlide([currentSlideId[0]]));
          dispatch(addElement({ slideId: currentSlideId, element: elementText }));
          dispatch(selectElements([elementText.id]));
        }
        break;
      case "add-image":
        dispatch(selectSlide([currentSlideId[0]]));
        createImageElement().then((elementImage) => {
          if (currentSlideId.length > 0) {
            dispatch(addElement({ slideId: currentSlideId, element: elementImage }));
            dispatch(selectElements([elementImage.id]))
          }
        });
        break;
      case "change-background":
        dispatch(selectSlide([currentSlideId[0]]));
        dispatch(clearSelection());
        handleChangeBackground();
        break;
      case "remove-element":
        dispatch(selectSlide([currentSlideId[0]]));
        if (selectedElementIds.length > 0 && currentSlideId.length > 0) {
          dispatch(removeElements({
            slideId: currentSlideId,
            elementIds: selectedElementIds
          }));
          dispatch(clearSelection());
        }
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  return handleToolbarAction;
}