// view/Slide/СomponentsSlide/UndoRedoButtons.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/redux'; 
import { setCanUndo, setCanRedo } from '../../store/history/undoRedoSlice'; 
import { undoStack } from '../../store/history/undoStackInstance'; 

const UndoRedoButtons: React.FC = () => {
  const dispatch = useAppDispatch();
  const { canUndo, canRedo } = useAppSelector((state) => state.undoRedo);

  const handleUndo = () => {
    if (!canUndo) return;

    const context = undoStack.undo();

    if (context?.slideId) {
    const slideElement = document.getElementById(`slide-thumb-${context.slideId}`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

    dispatch(setCanUndo(undoStack.canUndo));
    dispatch(setCanRedo(undoStack.canRedo));
    
  };

  const handleRedo = () => {
    if (!canRedo) return;

    const context = undoStack.redo();

    if (context?.slideId) {
    const slideElement = document.getElementById(`slide-thumb-${context.slideId}`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

    dispatch(setCanUndo(undoStack.canUndo));
    dispatch(setCanRedo(undoStack.canRedo));
    
  };

  return (
    <div className="undo-redo-buttons" style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        title="Отменить (Ctrl+Z)"
        style={{
          padding: '8px 16px',
          backgroundColor: canUndo ? '#1976d2' : '#e0e0e0',
          color: canUndo ? 'white' : '#9e9e9e',
          border: 'none',
          borderRadius: '4px',
          cursor: canUndo ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          opacity: canUndo ? 1 : 0.6,
        }}
        onMouseEnter={(e) => {
          if (canUndo) {
            e.currentTarget.style.backgroundColor = '#1565c0';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (canUndo) {
            e.currentTarget.style.backgroundColor = '#1976d2';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <span style={{ fontSize: '18px' }}>↶</span>
        Undo
      </button>
      <button
        onClick={handleRedo}
        disabled={!canRedo}
        title="Повторить (Ctrl+Y или Ctrl+Shift+Z)"
        style={{
          padding: '8px 16px',
          backgroundColor: canRedo ? '#1976d2' : '#e0e0e0',
          color: canRedo ? 'white' : '#9e9e9e',
          border: 'none',
          borderRadius: '4px',
          cursor: canRedo ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          opacity: canRedo ? 1 : 0.6,
        }}
        onMouseEnter={(e) => {
          if (canRedo) {
            e.currentTarget.style.backgroundColor = '#1565c0';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (canRedo) {
            e.currentTarget.style.backgroundColor = '#1976d2';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <span style={{ fontSize: '18px' }}>↷</span>
        Redo
      </button>
    </div>
  );
};

export default UndoRedoButtons;