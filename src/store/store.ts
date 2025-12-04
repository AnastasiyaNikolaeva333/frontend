import { createStore, combineReducers, applyMiddleware } from 'redux'
import { presentationReducer } from './reducers/presentationReducer'
import { slidesReducer } from './reducers/slidesReducer'
import { selectedReducer } from './reducers/selectedReducer'
import { elementsReducer } from './reducers/elementsReducer'
import { generateUuidMiddleware } from './middleware/generateUuid'
import { composeWithDevTools } from '@redux-devtools/extension'
import { maximalPresentation } from '../utils/tests/DataTestPresentation'
import { createNewSlide } from '../utils/function/functionCreateElements'
//Объединить редъюсер в один
const reducers = combineReducers({
  title: presentationReducer,
  slides: slidesReducer,
  selected: selectedReducer,
  elements: elementsReducer,
})

const rootReducer = (state: any, action: any) => {
  let newState = reducers(state, action);

  if (action.type.startsWith('ADD_ELEMENT') ||
    action.type.startsWith('REMOVE_ELEMENTS') ||
    action.type.startsWith('UPDATE_ELEMENT') ||
    action.type === 'UPDATE_TEXT_CONTENT') {
    newState = {
      ...newState,
      slides: elementsReducer(newState.slides, action)
    };
  }

  return newState;
}

const middlewares = [
  generateUuidMiddleware
]

const composeEnhancers = composeWithDevTools({});

const initialState = {
  title: maximalPresentation.title,
  slides: maximalPresentation.allSlides.length > 0 ? maximalPresentation.allSlides : [createNewSlide()],
  selected: maximalPresentation.selected
};

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(...middlewares)
  )
)

export {
  store,
}