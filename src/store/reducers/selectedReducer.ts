import { type ActionsUnion, type Selected } from '../types'
import * as SlidesActionCreators from '../action-creators/slides'
import * as ElementsActionCreators from '../action-creators/elements'

type SelectedActions = 
  | ActionsUnion<typeof SlidesActionCreators>
  | ActionsUnion<typeof ElementsActionCreators>

const initialState: Selected = {
  currentSlideId: null,
  selectedElementIds: new Set<string>()
}

const selectedReducer = (state = initialState, action: SelectedActions): Selected => {
    switch (action.type) {
        case 'SELECT_SLIDE':
            return {
                currentSlideId: action.payload,
                selectedElementIds: new Set<string>()
            }
        case 'SELECT_ELEMENTS':
            return {
                ...state,
                selectedElementIds: new Set<string>(action.payload) 
            }
        case 'ADD_SLIDE':
            return {
                currentSlideId: (action.payload as any).id,
                selectedElementIds: new Set<string>()
            }
        default:
            return state
    }
}

export {
    selectedReducer
}