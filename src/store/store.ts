import { configureStore } from "@reduxjs/toolkit";
import presentationReducer from "./slice/presentationSlice";
import selectionReducer from "./slice/selectedSlice";
import undoRedoReducer from "./history/undoRedoSlice";
import { createUndoRedoMiddleware } from "./history/undoRedoMiddleware";

const undoRedoMiddleware = createUndoRedoMiddleware();

export const store = configureStore({
  reducer: {
    presentation: presentationReducer,
    selection: selectionReducer,
    undoRedo: undoRedoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(undoRedoMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;