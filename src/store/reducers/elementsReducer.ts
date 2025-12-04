import { type ActionsUnion, type Slide } from '../types'
import * as ElementsActionCreators from '../action-creators/elements'

type ElementsActions = ActionsUnion<typeof ElementsActionCreators>

const elementsReducer = (state: Slide[] = [], action: ElementsActions): Slide[] => {
    switch (action.type) {
        case 'ADD_ELEMENT':
            return state.map(slide =>
                slide.id === action.payload.slideId
                    ? {
                        ...slide,
                        elements: [...slide.elements, action.payload.element as any]
                    }
                    : slide
            )
        case 'REMOVE_ELEMENTS':
            return state.map(slide =>
                slide.id === action.payload.slideId
                    ? {
                        ...slide,
                        elements: slide.elements.filter(
                            element => !action.payload.elementIds.includes(element.id)
                        )
                    }
                    : slide
            )
        case 'UPDATE_ELEMENT_POSITION':
            return state.map(slide => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }

                const elementIndex = slide.elements.findIndex(el => el.id === action.payload.elementId);
                if (elementIndex === -1) return slide;

                const updatedElements = [...slide.elements];

                updatedElements[elementIndex] = {
                    ...updatedElements[elementIndex],
                    position: action.payload.newPosition
                };

                if (elementIndex !== updatedElements.length - 1) {
                    const [movedElement] = updatedElements.splice(elementIndex, 1);
                    updatedElements.push(movedElement);
                }

                return {
                    ...slide,
                    elements: updatedElements
                };
            })

        case 'UPDATE_ELEMENT_SIZE':
            return state.map(slide => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }

                return {
                    ...slide,
                    elements: slide.elements.map(element =>
                        element.id === action.payload.elementId
                            ? { ...element, sizes: action.payload.newSize }
                            : element
                    )
                };
            })

        case 'UPDATE_TEXT_CONTENT':
            return state.map(slide => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }

                return {
                    ...slide,
                    elements: slide.elements.map(element =>
                        element.id === action.payload.elementId && element.type === 'text'
                            ? { ...element, content: action.payload.newText }
                            : element
                    )
                };
            })
        default:
            return state
    }
}

export {
    elementsReducer
}