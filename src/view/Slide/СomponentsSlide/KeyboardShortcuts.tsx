// view/Slide/ComponentsSlide/KeyboardShortcuts.tsx
import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../utils/hooks/redux';
import { undoStack } from '../../../store/history/undoStackInstance';
import { setCanUndo, setCanRedo } from '../../../store/history/undoRedoSlice';

interface KeyboardShortcutsProps {
  children?: React.ReactNode;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isUndoKey = (e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey;
      const isRedoKey = (e.ctrlKey || e.metaKey) && 
                       ((e.key === 'y') || (e.shiftKey && e.key === 'z'));

      if (isUndoKey) {
        e.preventDefault();
        e.stopPropagation();
        
        if (undoStack.canUndo) {
          const context = undoStack.undo();
          dispatch(setCanUndo(undoStack.canUndo));
          dispatch(setCanRedo(undoStack.canRedo));
          
          if (context?.slideId) {
            const slideElement = document.getElementById(`slide-thumb-${context.slideId}`);
            if (slideElement) {
              slideElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }
      } else if (isRedoKey) {
        e.preventDefault();
        e.stopPropagation();
        
        if (undoStack.canRedo) {
          const context = undoStack.redo();
          dispatch(setCanUndo(undoStack.canUndo));
          dispatch(setCanRedo(undoStack.canRedo));
          
          if (context?.slideId) {
            const slideElement = document.getElementById(`slide-thumb-${context.slideId}`);
            if (slideElement) {
              slideElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default KeyboardShortcuts;