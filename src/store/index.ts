import type { RootState } from "./types";
import type { AppDispatch } from "./types";
export { store } from "./store";
export type { AppDispatch };

export { 
  changePresentationTitle,
  addSlide,
  removeSlides,
  updateSlideBackground,
  changeSlidePositions,
  addElement,
  removeElements,
  updateElementPositions,
  updateElementSize,
  updateTextContent,
} from "./slice/presentationSlice";

export { selectSlide, selectElements, clearSelection } from "./slice/selectedSlice";

export { undo, redo } from "./history/undoRedoSlice";

export const selectPresentationTitle = (state: RootState) => state.presentation.title;
export const selectSlides = (state: RootState) => state.presentation.slides;
export const selectCurrentSlideId = (state: RootState) => state.selection.currentSlideId;
export const selectSelectedElementIds = (state: RootState) => state.selection.selectedElementIds;

export const selectCurrentSlide = (state: RootState) => {
  const currentSlideId = state.selection.currentSlideId;

  if (currentSlideId.length > 0) {
    const slide = state.presentation.slides.find((slide: any) => slide.id === currentSlideId[0]);
    if (slide) return slide;
  }

  if (state.presentation.slides.length > 0) {
    return state.presentation.slides[0];
  }

  return null;
};
