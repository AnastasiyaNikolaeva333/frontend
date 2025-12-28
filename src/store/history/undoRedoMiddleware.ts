// store/history/undoRedoMiddleware.ts
import type { Middleware, UnknownAction } from '@reduxjs/toolkit';
import { setCanUndo, setCanRedo } from './undoRedoSlice';
import type { RootState } from '../store';
import type { UndoStack } from './undoRendo'; 
import { restoreState } from '../slice/slidesSlice';
import { selectSlide, selectElements } from '../slice/selectedSlice';
import { changePresentationTitle } from '../slice/presentationSlice';

let isExecutingFromHistory = false;

const shouldIgnoreAction = (actionType: string): boolean => {
  const ignoredActions = [
    'undoRedo/setCanUndo',
    'undoRedo/setCanRedo',
    'undoRedo/setLastActionContext',
    'undoRedo/undo',
    'undoRedo/redo',
    
    'selection/selectSlide',
    'selection/selectElements',
    'selection/selectElement',
    'selection/clearSelection',
    'selection/deselectElement',
    
    'slides/restoreState',
  ];
  
  return ignoredActions.includes(actionType);
};

export const createUndoRedoMiddleware = (undoStack: UndoStack): Middleware => {
  return storeAPI => next => (action: unknown) => {
    const typedAction = action as UnknownAction;
    
    if (isExecutingFromHistory) {
      return next(typedAction);
    }
    
    if (shouldIgnoreAction(typedAction.type)) {
      return next(typedAction);
    }

    const stateBefore = storeAPI.getState() as RootState;
    
    const fullSnapshotBefore = {
      slides: JSON.parse(JSON.stringify(stateBefore.slides.slides)),
      presentation: {
        title: stateBefore.presentation.title
      },
      selection: {
        currentSlideId: stateBefore.selection.currentSlideId,
        selectedElementIds: [...stateBefore.selection.selectedElementIds]
      }
    };
    
    const result = next(typedAction);
    
    const stateAfter = storeAPI.getState() as RootState;
    const fullSnapshotAfter = {
      slides: JSON.parse(JSON.stringify(stateAfter.slides.slides)),
      presentation: {
        title: stateAfter.presentation.title
      },
      selection: {
        currentSlideId: stateAfter.selection.currentSlideId,
        selectedElementIds: [...stateAfter.selection.selectedElementIds]
      }
    };

    const undoAction = {
      do: () => {
        isExecutingFromHistory = true;
        try {
          storeAPI.dispatch(restoreState({ 
            slides: JSON.parse(JSON.stringify(fullSnapshotAfter.slides))
          }));
          
          storeAPI.dispatch(changePresentationTitle(fullSnapshotAfter.presentation.title));
          
          if (fullSnapshotAfter.selection.currentSlideId) {
            storeAPI.dispatch(selectSlide(fullSnapshotAfter.selection.currentSlideId));
          }
          storeAPI.dispatch(selectElements([...fullSnapshotAfter.selection.selectedElementIds]));
          
        } finally {
          isExecutingFromHistory = false;
        }
      },
      undo: () => {
        isExecutingFromHistory = true;
        try {
          storeAPI.dispatch(restoreState({ 
            slides: JSON.parse(JSON.stringify(fullSnapshotBefore.slides))
          }));

          storeAPI.dispatch(changePresentationTitle(fullSnapshotBefore.presentation.title));
          
          if (fullSnapshotBefore.selection.currentSlideId) {
            storeAPI.dispatch(selectSlide(fullSnapshotBefore.selection.currentSlideId));
          }
          storeAPI.dispatch(selectElements([...fullSnapshotBefore.selection.selectedElementIds]));
          
        } finally {
          isExecutingFromHistory = false;
        }
      },
      context: getActionContext(typedAction, stateBefore),
    };

    undoStack.push(undoAction);

    storeAPI.dispatch(setCanUndo(undoStack.canUndo));
    storeAPI.dispatch(setCanRedo(undoStack.canRedo));
    
    return result;
  };
};

function getActionContext(action: UnknownAction, state: RootState) {
  const { type, payload } = action as any;
  
  switch (type) {
    case 'slides/addSlide':
      return { slideId: payload.slide?.id || payload.id };
      
    case 'slides/removeSlide':
      return { slideId: payload };
      
    case 'slides/addElement':
      return {
        slideId: payload.slideId,
        elementIds: [payload.element?.id || payload.id],
      };
      
    case 'slides/removeElements':
      return {
        slideId: payload.slideId,
        elementIds: payload.elementIds,
      };
      
    case 'slides/updateElementPosition':
    case 'slides/updateElementSize':
    case 'slides/updateElement':
    case 'slides/updateTextContent':
      return {
        slideId: payload.slideId,
        elementIds: [payload.elementId],
      };
      
    case 'slides/updateMultipleElementPositions':
      const elementIds = payload.map((item: any) => item.elementId);
      return {
        slideId: payload[0]?.slideId,
        elementIds,
      };
      
    case 'slides/updateSlideBackground':
      return {
        slideId: payload.slideId,
      };
      
    case 'presentation/changePresentationTitle':
      return { slideId: state.selection.currentSlideId };
      
    default:
      return { slideId: state.selection.currentSlideId };
  }
}