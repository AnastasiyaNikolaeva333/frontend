import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ActionContext = {
  slideId: string[];
  elementIds?: string[];
};

export type Snapshot = {
  slides: any;
  presentation: { title: string };
  selection: { currentSlideId: string[]; selectedElementIds: string[] };
};

export type HistoryEntry = {
  snapshot: Snapshot;
  context: ActionContext | null;
};

type UndoRedoState = {
  past: HistoryEntry[];
  future: HistoryEntry[];
  canUndo: boolean;
  canRedo: boolean;
  lastActionContext: ActionContext | null;
};

const initialState: UndoRedoState = {
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,
  lastActionContext: null,
};

const undoRedoSlice = createSlice({
  name: "undoRedo",
  initialState,
  reducers: {
    setCanUndo: (state, action: PayloadAction<boolean>) => {
      state.canUndo = action.payload;
    },
    setCanRedo: (state, action: PayloadAction<boolean>) => {
      state.canRedo = action.payload;
    },

    setHistory: (
      state,
      action: PayloadAction<{ past: HistoryEntry[]; future: HistoryEntry[] }>,
    ) => {
      state.past = action.payload.past;
      state.future = action.payload.future;
      state.canUndo = state.past.length > 0;
      state.canRedo = state.future.length > 0;
    },

    clearHistory: (state) => {
      state.past = [];
      state.future = [];
      state.canUndo = false;
      state.canRedo = false;
      state.lastActionContext = null;
    },

    setLastActionContext: (state, action: PayloadAction<ActionContext>) => {
      state.lastActionContext = action.payload;
    },

    undo: () => {},
    redo: () => {},
  },
});

export const {
  setCanUndo,
  setCanRedo,
  setHistory,
  clearHistory,
  setLastActionContext,
  undo,
  redo,
} = undoRedoSlice.actions;

export default undoRedoSlice.reducer;
