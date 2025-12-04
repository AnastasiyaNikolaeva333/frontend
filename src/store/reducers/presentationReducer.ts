import { type ActionsUnion } from '../types'
import * as PresentationActionCreators from '../action-creators/presentationTitle'

type PresentationActions = ActionsUnion<typeof PresentationActionCreators>

const presentationReducer = (state = '', action: PresentationActions): string => {
    switch (action.type) {
        case 'CHANGE_PRESENTATION_TITLE':
            return action.payload
        default:
            return state
    }
}

export {
    presentationReducer
}