import { type ActionsUnion, type Slide } from '../types'
import * as SlidesActionCreators from '../action-creators/slides'

type SlidesActions = ActionsUnion<typeof SlidesActionCreators>

const initState: Slide[] = []

const slidesReducer = (state = initState, action: SlidesActions): Slide[] => {
    switch (action.type) {
        case 'ADD_SLIDE':
            const { slide, currentIndex } = action.payload;
            const selectedSlideIndex = state.findIndex(
                slideItem => slideItem.id === currentIndex
            );

            if (selectedSlideIndex === -1) {
                return [...state, slide];
            }

            return [
                ...state.slice(0, selectedSlideIndex + 1),
                slide,
                ...state.slice(selectedSlideIndex + 1)
            ];

        case 'REMOVE_SLIDE':
            return state.filter(item => item.id !== action.payload)

        case 'UPDATE_SLIDE_BACKGROUND':
            return state.map(slide =>
                slide.id === action.payload.slideId
                    ? { ...slide, background: action.payload.background }
                    : slide
            )

        case 'CHANGE_SLIDES_POSITION': {
            const { slideIds, targetIndex } = action.payload;

            if (slideIds.length === 0) return state;


            const slideIndexes = slideIds.map(id =>
                state.findIndex(slide => slide.id === id)
            ).filter(index => index !== -1);

            if (slideIndexes.length === 0) return state;

            const sortedIndexes = [...slideIndexes].sort((a, b) => a - b);
            const slidesToMove = sortedIndexes.map(index => state[index]);
            const newSlides = state.filter((_, index) => !sortedIndexes.includes(index));
            let insertIndex: number;

            const slidesBeforeTarget = newSlides.slice(0, targetIndex).length;

            if (targetIndex <= sortedIndexes[0]) {
                insertIndex = targetIndex;
            } else {
                insertIndex = slidesBeforeTarget;
            }
            
            newSlides.splice(insertIndex, 0, ...slidesToMove);

            return newSlides;
        }

        default:
            return state
    }
}

export {
    slidesReducer,
}