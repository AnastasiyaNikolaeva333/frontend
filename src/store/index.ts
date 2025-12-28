import type { RootState } from './types';
import type { AppDispatch } from './types';
export { store } from './store';
export type { AppDispatch };

export {
  changePresentationTitle,
} from './slice/presentationSlice';

export {
  selectSlide,
  selectElements,
  clearSelection,
} from './slice/selectedSlice';

export {
  addSlide,
  removeSlides,
  updateSlideBackground,
  changeSlidePositions,
  addElement,
  removeElements,
  updateElementPosition,
  updateMultipleElementPositions,
  updateElementSize,
  updateTextContent,
} from './slice/slidesSlice';

export { undo, redo } from './history/undoRedoSlice';


export const selectPresentationTitle = (state: RootState) => state.presentation.title;
export const selectSlides = (state: RootState) => state.slides.slides;
export const selectCurrentSlideId = (state: RootState) => state.selection.currentSlideId;
export const selectSelectedElementIds = (state: RootState) => state.selection.selectedElementIds;

export const selectCurrentSlide = (state: RootState) => {
  const currentSlideId = state.selection.currentSlideId;
  
  if (currentSlideId.length > 0) {
    const slide = state.slides.slides.find((slide: any) => slide.id === currentSlideId[0]);
    if (slide) return slide;
  }
  
  if (state.slides.slides.length > 0) {
    return state.slides.slides[0];
  }
  
  return null;
};