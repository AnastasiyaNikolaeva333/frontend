import type {ID, Selected } from "../../types/presentationTypes.ts";

function createSelected(): Selected {
  return {
    currentSlideId: null,
    selectedElementIds: new Set<ID>(),
  };
}

function saveTitle() {
  console.log("Сохранение презентации");
}

export {
  createSelected,
  saveTitle,
}