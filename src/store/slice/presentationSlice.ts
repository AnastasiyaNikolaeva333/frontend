import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type PresentationState ={
  title: string;
}

const initialState: PresentationState = {
  title: 'Новая презентация',
};

const presentationSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    changePresentationTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const { changePresentationTitle } = presentationSlice.actions;
export default presentationSlice.reducer;