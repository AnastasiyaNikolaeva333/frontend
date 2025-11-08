import type {
    Presentation,
    SlideElement,
    ID,
    Position,
    Size,
    Color,
    ImageElement,
} from "../../types/presentationTypes";

function selectElements(presentation: Presentation, elementIds: ID[]): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;
    const newSelected = new Set(elementIds);

    return {
        ...presentation,
        selected: {
            ...presentation.selected,
            selectedElementIds: newSelected,
        },
    };
}

function deselectElements(presentation: Presentation, elementIds?: ID[]): Presentation {
    const newSelected = new Set(presentation.selected.selectedElementIds);

    if (elementIds === undefined) {
        newSelected.clear();
    } else {
        const idsArray = [...elementIds];
        idsArray.forEach((id) => newSelected.delete(id));
    }
    return {
        ...presentation,
        selected: {
            ...presentation.selected,
            selectedElementIds: newSelected,
        },
    };
}

function addElement(presentation: Presentation, element: SlideElement): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;
    const newPresentation = {
        ...presentation,
        allSlides: presentation.allSlides.map((slide) =>
            slide.id === presentation.selected.currentSlideId
                ? { ...slide, elements: [...slide.elements, element] }
                : slide,
        ),
    };

    return selectElements(newPresentation, [element.id]);
}

function removeElements(presentation: Presentation, elementIds: ID[]): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;

    const idsArray = [...elementIds];

    const newPresentation = {
        ...presentation,
        allSlides: presentation.allSlides.map((slide) =>
            slide.id === presentation.selected.currentSlideId
                ? {
                    ...slide,
                    elements: slide.elements.filter((element) => !idsArray.includes(element.id)),
                }
                : slide,
        ),
    };

    return deselectElements(newPresentation, idsArray);
}

function updateElementPosition(
    presentation: Presentation,
    param: {
        newPosition: Position,
        elementId: ID,
    }
): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;

    return {
        ...presentation,
        allSlides: presentation.allSlides.map((slide) =>
            slide.id === presentation.selected.currentSlideId
                ? {
                    ...slide,
                    elements: slide.elements.map((element) =>
                        element.id === param.elementId
                            ? {
                                ...element,
                                position: param.newPosition
                            }
                            : element,
                    ),
                }
                : slide,
        ),
    };
}

function updateElementSize(presentation: Presentation, newSize: Size, elementId: ID): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;

    return {
        ...presentation,
        allSlides: presentation.allSlides.map((slide) =>
            slide.id === presentation.selected.currentSlideId
                ? {
                    ...slide,
                    elements: slide.elements.map((element) =>
                        element.id === elementId ? { ...element, sizes: newSize } : element,
                    ),
                }
                : slide,
        ),
    };
}

function updateTextContent(
    presentation: Presentation,
    param: {
        newText: string,
        elementId: ID,
    }
): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;

    return {
        ...presentation,
        allSlides: presentation.allSlides.map((slide) =>
            slide.id === presentation.selected.currentSlideId
                ? {
                    ...slide,
                    elements: slide.elements.map((element) =>
                        element.id === param.elementId && element.type === "text"
                            ? { ...element, content: param.newText }
                            : element,
                    ),
                }
                : slide,
        ),
    };
}

function updateFontFamily(
    presentation: Presentation,
    newFamily: string,
    elementId: ID,
): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;

    return {
        ...presentation,
        allSlides: presentation.allSlides.map((slide) =>
            slide.id === presentation.selected.currentSlideId
                ? {
                    ...slide,
                    elements: slide.elements.map((element) =>
                        element.id === elementId && element.type === "text"
                            ? {
                                ...element,
                                style: { ...element.style, fontFamily: newFamily },
                            }
                            : element,
                    ),
                }
                : slide,
        ),
    };
}

function updateFontSize(presentation: Presentation, newSize: string, elementId: ID): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;

    return {
        ...presentation,
        allSlides: presentation.allSlides.map((slide) =>
            slide.id === presentation.selected.currentSlideId
                ? {
                    ...slide,
                    elements: slide.elements.map((element) =>
                        element.id === elementId && element.type === "text"
                            ? { ...element, style: { ...element.style, fontSize: newSize } }
                            : element,
                    ),
                }
                : slide,
        ),
    };
}

function updateTextColor(presentation: Presentation, newColor: Color, elementId: ID): Presentation {
    if (!presentation.selected.currentSlideId) return presentation;

    return {
        ...presentation,
        allSlides: presentation.allSlides.map((slide) =>
            slide.id === presentation.selected.currentSlideId
                ? {
                    ...slide,
                    elements: slide.elements.map((element) =>
                        element.id === elementId && element.type === "text"
                            ? { ...element, style: { ...element.style, color: newColor } }
                            : element,
                    ),
                }
                : slide,
        ),
    };
}

function createTextElement() {
    return {
        id: `text-${Date.now()}`,
        type: "text",
        content: "",
        position: { x: 100, y: 100 },
        sizes: { width: "auto", height: "auto" },
        style: {
            color: { color: "#000000" },
            fontStyle: "normal",
            fontFamily: "Arial",
            fontSize: "16px",
            fontWight: "700",
        }
    };
}

function createImageElement(): Promise<ImageElement> {
    return new Promise<ImageElement>((resolve) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const src = event.target?.result as string;
                    const imageElement: ImageElement = {
                        id: `image-${Date.now()}`,
                        type: "image",
                        src: src,
                        position: { x: "0px", y: "0px" },
                        sizes: { width: "", height: "" },
                    };
                    resolve(imageElement);
                    document.body.removeChild(fileInput);
                };

                reader.readAsDataURL(file);
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
    });
}

function handleElementClick(element: SlideElement) {
    const backgroundColor = element.type === "text" ? element.style.color.color : "transparent";
    console.log(`Элемент ID: ${element.id}, Цвет фона: ${backgroundColor}`);
}
export {
    addElement,
    removeElements,
    updateElementPosition,
    updateElementSize,
    updateTextContent,
    updateFontFamily,
    updateFontSize,
    updateTextColor,
    createImageElement,
    createTextElement,
    handleElementClick,
    selectElements,
    deselectElements,
}
