// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import slidesReducer from './slice/slidesSlice';
import presentationReducer from './slice/presentationSlice';
import selectionReducer from './slice/selectedSlice';
import undoRedoReducer from './history/undoRedoSlice';
import { maximalPresentation } from '../utils/tests/DataTestPresentation';
import { createNewSlide } from '../utils/function/functionCreateElements';
import { createUndoRedoMiddleware } from './history/undoRedoMiddleware';
import { undoStack } from './history/undoStackInstance';

const getPreloadedState = () => {
  let slides: any[] = [];
  
  if (maximalPresentation?.allSlides) {
    slides = Array.isArray(maximalPresentation.allSlides) 
      ? maximalPresentation.allSlides 
      : [maximalPresentation.allSlides];
  }
  
  if (slides.length === 0) {
    slides = [createNewSlide()];
  }
  
  const firstSlideId = slides[0]?.id || null;
  
  return {
    presentation: {
      title: maximalPresentation?.title || 'Новая презентация'
    },
    slides: {
      slides: slides
    },
    selection: {
      currentSlideId: maximalPresentation?.selected?.currentSlideId || firstSlideId,
      selectedElementIds: Array.from(maximalPresentation?.selected?.selectedElementIds || [])
    },
    undoRedo: {
      canUndo: false,
      canRedo: false,
      lastActionContext: null
    }
  };
};


const undoRedoMiddleware = createUndoRedoMiddleware(undoStack);

export const store = configureStore({
  reducer: {
    presentation: presentationReducer,
    slides: slidesReducer,
    selection: selectionReducer,
    undoRedo: undoRedoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(undoRedoMiddleware),
  preloadedState: getPreloadedState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;