// store/history/undoRedoSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ActionContext = {
  slideId: string | null;
  elementIds?: string[];
};

type UndoRedoState = {
  canUndo: boolean;
  canRedo: boolean;
  lastActionContext: ActionContext | null;
};

const initialState: UndoRedoState = {
  canUndo: false,
  canRedo: false,
  lastActionContext: null,
};

const undoRedoSlice = createSlice({
  name: 'undoRedo',
  initialState,
  reducers: {
    setCanUndo: (state, action: PayloadAction<boolean>) => {
      state.canUndo = action.payload;
    },
    setCanRedo: (state, action: PayloadAction<boolean>) => {
      state.canRedo = action.payload;
    },
    setLastActionContext: (state, action: PayloadAction<ActionContext>) => {
      state.lastActionContext = action.payload;
    },
    
    undo: () => {
    },
    redo: () => {
    },
  },
});

export const {
  setCanUndo,
  setCanRedo,
  setLastActionContext,
  undo,
  redo,
} = undoRedoSlice.actions;

export default undoRedoSlice.reducer;