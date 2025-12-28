import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type SelectionState = {
  currentSlideId: string[];
  selectedElementIds: string[];
}

const initialState: SelectionState = {
  currentSlideId: [],
  selectedElementIds: [],
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    selectSlide: (state, action: PayloadAction<string[]>) => {
      state.currentSlideId = action.payload;
      state.selectedElementIds = [];
    },

    selectElements: (state, action: PayloadAction<string[]>) => {
      state.selectedElementIds = action.payload;

    },

    clearSelection: (state) => {
      state.selectedElementIds = [];
    },
  },
});

export const { selectSlide, selectElements, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;