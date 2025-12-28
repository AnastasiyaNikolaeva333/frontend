// utils/hooks/useUndoRedo.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { setCanUndo, setCanRedo } from '../../store/history/undoRedoSlice';
import { undoStack } from '../../store/history/undoStackInstance';

export const useUndoRedo = () => {
  const dispatch = useAppDispatch();
  const { canUndo, canRedo } = useAppSelector((state) => state.undoRedo);

  const undo = useCallback(() => {
    if (!canUndo) return;
    
    const context = undoStack.undo();
    dispatch(setCanUndo(undoStack.canUndo));
    dispatch(setCanRedo(undoStack.canRedo));
    
    return context;
  }, [canUndo, dispatch]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    
    const context = undoStack.redo();
    dispatch(setCanUndo(undoStack.canUndo));
    dispatch(setCanRedo(undoStack.canRedo));
    
    return context;
  }, [canRedo, dispatch]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    undoStack,
  };
};