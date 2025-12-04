import type { store } from './store';
import * as ActionCreators from './action-creators/'

type ActionsUnion<T extends Record<string, (...args: any[]) => any>> = 
  ReturnType<T[keyof T]>;

type AppStore = typeof store
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

type AllActions = ActionsUnion<typeof ActionCreators>

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

export type {
    ActionsUnion,
    AppStore,
    RootState,
    AppDispatch,
    AllActions,
}