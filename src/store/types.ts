import { store } from './store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type { 
  ID,
  Position, 
  Size, 
  Color, 
  Background, 
  TextElement, 
  ImageElement, 
  SlideElement, 
  Slide,
  Selected 
} from '../types/presentationTypes';