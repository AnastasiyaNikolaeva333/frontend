import type { SlideElement, Position, Size } from '../types'

const addElement = (slideId: string, element: Omit<SlideElement, 'id'>) => ({
    type: 'ADD_ELEMENT' as const,
    payload: { slideId, element },
    needUuid: true,
    
})

const removeElements = (slideId: string, elementIds: string[]) => ({
    type: 'REMOVE_ELEMENTS' as const,
    payload: { slideId, elementIds }
})

const selectElements = (elementIds: string[]) => ({
    type: 'SELECT_ELEMENTS' as const,
    payload: elementIds
})

const updateElementPosition = (slideId: string, elementId: string, newPosition: Position) => ({
    type: 'UPDATE_ELEMENT_POSITION' as const,
    payload: { slideId, elementId, newPosition }
})

const updateElementSize = (slideId: string, elementId: string, newSize: Size) => ({
    type: 'UPDATE_ELEMENT_SIZE' as const,
    payload: {slideId, elementId, newSize }
})

const updateTextContent = (slideId: string, elementId: string, newText: string) => ({
    type: 'UPDATE_TEXT_CONTENT' as const,
    payload: { slideId, elementId, newText }
});

export {
    addElement,
    removeElements,
    selectElements,
    updateElementPosition,
    updateElementSize,
    updateTextContent,
}