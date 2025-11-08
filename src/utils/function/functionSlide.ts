import type {
    Presentation,
    Slide,
    ID,
    Background,
} from "../../types/presentationTypes.ts";

import { standardColorBackround } from "../tests/DataTestPresentation.ts";
import { createSelected } from "./functionPresentation";
import { dispatch } from "../../editor.ts";

function selectSlide(presentation: Presentation, slideId: ID): Presentation {
    return {
        ...presentation,
        selected: {
            currentSlideId: slideId,
            selectedElementIds: new Set<ID>(),
        },
    };
}

function addSlide(presentation: Presentation, slide: Slide): Presentation {
    const selectedSlideIndex = presentation.allSlides.findIndex(
        slide => slide.id === presentation.selected.currentSlideId
    );

    const newPresentation = {
        ...presentation,
        allSlides: selectedSlideIndex === -1
            ? [...presentation.allSlides, slide]
            : [
                ...presentation.allSlides.slice(0, selectedSlideIndex + 1),
                slide,
                ...presentation.allSlides.slice(selectedSlideIndex + 1)
            ]
    };
    
    return selectSlide(newPresentation, slide.id);
}

function removeSlides(presentation: Presentation, slideIds: ID[]): Presentation {
    const idsArray = [...slideIds];

    const newAllSlides = presentation.allSlides.filter((slide) => !idsArray.includes(slide.id));
    const currentSlideRemoved = idsArray.includes(presentation.selected.currentSlideId || "");

    return {
        ...presentation,
        allSlides: newAllSlides,
        selected: currentSlideRemoved ? createSelected() : presentation.selected,
    };
}

function changeSlidePosition(
    presentation: Presentation,
    param: {
        slideId: ID,
        newIndex: number,
    }
): Presentation {
    const slides = [...presentation.allSlides];
    const currentIndex = slides.findIndex((slide) => slide.id === param.slideId);

    if (currentIndex === -1 || currentIndex === param.newIndex) {
        return presentation;
    }

    const [slide] = slides.splice(currentIndex, 1);
    slides.splice(param.newIndex, 0, slide);

    return {
        ...presentation,
        allSlides: slides,
    };
}

function updateSlideBackground(
    presentation: Presentation,
    newBackground: Background,
): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;

    return {
        ...presentation,
        allSlides: presentation.allSlides.map((slide) =>
            slide.id === presentation.selected.currentSlideId
                ? { ...slide, background: newBackground }
                : slide,
        ),
    };
}

function createNewSlide() {
    return {
        id: `slide-${Date.now()}`,
        elements: [],
        background: standardColorBackround,
    };
}

function handleSlideClick(slide: Slide, index: number) {
    dispatch(selectSlide, slide.id);
    console.log(`Слайд ID: ${slide.id}, Порядковый номер: ${index + 1}`);
};

export {
    addSlide,
    removeSlides,
    changeSlidePosition,
    updateSlideBackground,
    createNewSlide,
    handleSlideClick,
    selectSlide,
}