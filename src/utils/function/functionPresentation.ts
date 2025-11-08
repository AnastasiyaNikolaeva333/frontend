import type { Presentation, ID, Selected } from "../../types/presentationTypes.ts";

function createSelected(): Selected {
  return {
    currentSlideId: null,
    selectedElementIds: new Set<ID>(),
  };
}

function renamePresentation(presentation: Presentation, newTitle: string): Presentation {
  return {
    ...presentation,
    title: newTitle,
  };
}

function saveTitle() {
  console.log("Сохранение презентации");
}

export {
  createSelected,
  renamePresentation,
  saveTitle,
};
