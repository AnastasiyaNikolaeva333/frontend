import type {ID, Selected } from "../../types/presentationTypes.ts";

function createSelected(): Selected {
  return {
    currentSlideId: [],
    selectedElementIds: new Set<ID>(),
  };
}


export {
  createSelected,
}