import type { Presentation } from "../../types/presentationTypes";
import { dispatch } from "../../editor";
import { addSlide, removeSlides, createNewSlide, selectSlide } from "./functionSlide";
import { addElement, createImageElement, createTextElement, removeElements, selectElements } from "./functionElementsSlide";
import { handleChangeBackground } from "./functionBackround";

function handleToolbarAction(action: string, presentation: Presentation) {
    console.log("Действие:", action);
    switch (action) {
        case "add-slide":
            const newSlide = createNewSlide();
            dispatch(addSlide, newSlide);
            break;
        case "remove-slide":
            dispatch(selectSlide, presentation.selected.currentSlideId);
            dispatch(removeSlides, [presentation.selected.currentSlideId]);
            break;
        case "add-text":
            const elementText = createTextElement();
            dispatch(addElement, elementText);
            dispatch(selectElements, [elementText.id]);
            console.log("Добавление текста", presentation.selected.selectedElementIds.size);
            break;
        case "add-image":
            createImageElement().then((elementImage) => {
                dispatch(addElement, elementImage);
                dispatch(selectElements, [elementImage.id]);
                console.log("Добавление изображения", presentation.selected.selectedElementIds.size);
            });
            break;
        case "change-background":
            handleChangeBackground();
            console.log("Изменение фона");
            break;
        case "remove-element":
            if (presentation.selected.selectedElementIds) {
                const elementIdArray = Array.from(presentation.selected.selectedElementIds);
                dispatch(removeElements, elementIdArray);
            } else {
                dispatch(removeElements, [presentation.selected.currentSlideId]);
            }
            console.log("Удаление элемента");
            break;
        case "file":
            console.log("Меню Файл");
            break;
        case "correction":
            console.log("Меню Правка");
            break;
        case "view":
            console.log("Меню Вид");
            break;
        case "insert":
            console.log("Меню Вставка");
            break;
        case "format":
            console.log("Меню Формат");
            break;
        case "slide":
            console.log("Меню Слайд");
            break;
        default:
            console.log("Неизвестное действие:", action);
    }
};

export {
    handleToolbarAction,
}