import type { ID, Slide, Background } from '../types'

const addSlide = (slide: Slide, currentIndex: ID |null) => ({
    type: 'ADD_SLIDE' as const,
    payload: {slide, currentIndex},
})

const removeSlide = (slideId: string) => ({
    type: 'REMOVE_SLIDE' as const,
    payload: slideId
})

const selectSlide = (slideId: string) => ({
    type: 'SELECT_SLIDE' as const,
    payload: slideId
})

const changeSlidePosition = (slideId: string, newIndex: number) => ({
    type: 'CHANGE_SLIDE_POSITION' as const,
    payload: { slideId, newIndex }
})

const changeMultipleSlidesPosition = (slideIds: string[], targetIndex: number) => ({
    type: 'CHANGE_SLIDES_POSITION' as const,
    payload: { 
        slideIds,
        targetIndex 
    }
})

const updateSlideBackground = (slideId: string, background: Background) => ({
    type: 'UPDATE_SLIDE_BACKGROUND' as const,
    payload: { slideId, background }
})

export {
    addSlide,
    removeSlide,
    selectSlide,
    changeSlidePosition,
    changeMultipleSlidesPosition,
    updateSlideBackground,
}