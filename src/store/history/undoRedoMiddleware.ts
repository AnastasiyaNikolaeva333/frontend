import type { Middleware, UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { restoreState } from "../slice/presentationSlice";
import { selectSlide, selectElements, clearSelection } from "../slice/selectedSlice";
import { setHistory, setLastActionContext } from "./undoRedoSlice";
import type { ActionContext, HistoryEntry } from "./undoRedoSlice";
import { deleteImageFromStorage } from "../../appwrite/storageService";

let isExecutingFromHistory = false;

let pendingFileDeletions: string[] = [];

export const scheduleFileDeletion = (fileIds: string[]) => {
  pendingFileDeletions.push(...fileIds);
};

const cleanupPendingFiles = async () => {
  if (pendingFileDeletions.length === 0) return;

  const filesToDelete = [...pendingFileDeletions];
  pendingFileDeletions = [];

  for (const fileId of filesToDelete) {
    try {
      await deleteImageFromStorage(fileId);
    } catch (error) {
      console.error(`✗ Ошибка удаления файла ${fileId}:`, error);
    }
  }
};

const shouldIgnoreAction = (actionType: string): boolean => {
  const ignoredActions = [
    "undoRedo/setHistory",
    "undoRedo/clearHistory",
    "undoRedo/setLastActionContext",
    "undoRedo/undo",
    "undoRedo/redo",
    "selection/selectSlide",
    "selection/selectElements",
    "selection/selectElement",
    "selection/clearSelection",
    "presentation/restoreState",
    "presentation/addZerroSlide"
  ];

  return ignoredActions.includes(actionType);
};

type Snapshot = {
  presentation: { title: string };
  slides: any;
  selection: {
    currentSlideId: string[];
    selectedElementIds: string[]
  };
};

export const createUndoRedoMiddleware = (): Middleware => {
  return (storeAPI) => (next) => (action: unknown) => {
    const typedAction = action as UnknownAction;

    if (typedAction.type === "undoRedo/undo" || typedAction.type === "undoRedo/redo") {
      const result = next(typedAction);

      const stateNow = storeAPI.getState() as RootState;
      const { past, future } = stateNow.undoRedo;

      const snapshotNow = takeSnapshot(stateNow);

      if (typedAction.type === "undoRedo/undo") {
        if (past.length === 0) return result;

        const last = past[past.length - 1];
        const newPast = past.slice(0, -1);
        const newFuture = [{ snapshot: snapshotNow, context: last.context }, ...future];

        storeAPI.dispatch(setHistory({ past: newPast, future: newFuture }));
        applySnapshotAndContext(storeAPI, last.snapshot, last.context);

        setTimeout(() => {
          const stateAfterUndo = storeAPI.getState() as RootState;
          checkAndCleanupFiles(stateAfterUndo);
        }, 0);

        return result;
      }

      if (future.length === 0) return result;

      const first = future[0];
      const newFuture = future.slice(1);
      const newPast = [...past, { snapshot: snapshotNow, context: first.context }];

      storeAPI.dispatch(setHistory({ past: newPast, future: newFuture }));
      applySnapshotAndContext(storeAPI, first.snapshot, first.context);

      setTimeout(() => {
        const stateAfterRedo = storeAPI.getState() as RootState;
        checkAndCleanupFiles(stateAfterRedo);
      }, 0);

      return result;
    }

    if (isExecutingFromHistory) return next(typedAction);
    if (shouldIgnoreAction(typedAction.type)) return next(typedAction);

    const stateBefore = storeAPI.getState() as RootState;
    const snapshotBefore = takeSnapshot(stateBefore);

    const result = next(typedAction);

    const stateAfter = storeAPI.getState() as RootState;

    if (!didEditorStateChange(stateBefore, stateAfter)) {
      return result;
    }

    const context = getActionContext(typedAction, stateAfter);

    const entry: HistoryEntry = {
      snapshot: snapshotBefore,
      context,
    };

    const { past } = stateAfter.undoRedo;
    const newPast = [...past, entry];
    const newFuture: HistoryEntry[] = [];

    storeAPI.dispatch(setHistory({ past: newPast, future: newFuture }));

    setTimeout(() => {
      const stateAfterHistoryUpdate = storeAPI.getState() as RootState;
      checkAndCleanupFiles(stateAfterHistoryUpdate);
    }, 0);

    return result;
  };
};

function checkAndCleanupFiles(state: RootState) {
  const { past, future } = state.undoRedo;

  if (past.length === 1 && future.length === 0 && pendingFileDeletions.length > 0) {
    cleanupPendingFiles();
  }
}

function takeSnapshot(state: RootState): Snapshot {
  return {
    slides: state.presentation.slides,
    presentation: { title: state.presentation.title },
    selection: {
      currentSlideId: state.selection.currentSlideId,
      selectedElementIds: state.selection.selectedElementIds,
    },
  };
}

function didEditorStateChange(before: RootState, after: RootState) {
  return (
    before.presentation.slides !== after.presentation.slides ||
    before.presentation.title !== after.presentation.title
  );
}

function normalizeSlideIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((id): id is string => typeof id === 'string');
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [];
}

function getActionContext(action: UnknownAction, state: RootState): ActionContext | null {
  const { type, payload } = action as any;

  switch (type) {
    case "presentation/addSlide":
      return {
        slideId: payload?.slide?.id ? [payload.slide.id] : []
      };

    case "presentation/removeSlides":
      const remainingSlides = state.presentation.slides.filter(
        (slide: any) => !payload?.includes(slide.id)
      );
      return {
        slideId: remainingSlides.length > 0 ? [remainingSlides[0].id] : []
      };

    case "presentation/addElement":
      return {
        slideId: normalizeSlideIds(payload?.slideId),
        elementIds: payload?.element?.id ? [payload.element.id] : undefined,
      };

    case "presentation/removeElements":
      return {
        slideId: normalizeSlideIds(payload?.slideId),
      };

    case "presentation/updateElementPosition":
    case "presentation/updateElementSize":
    case "presentation/updateTextContent":
      return {
        slideId: normalizeSlideIds(payload?.slideId),
        elementIds: payload?.elementId ? [payload.elementId] : undefined,
      };

    case "presentation/updateMultipleElementPositions": {
      const elementIds = Array.isArray(payload)
        ? payload.map((i: any) => i.elementId).filter(Boolean)
        : [];
      return {
        slideId: normalizeSlideIds(payload?.[0]?.slideId),
        elementIds: elementIds.length ? elementIds : undefined,
      };
    }

    case "presentation/updateSlideBackground":
      return {
        slideId: normalizeSlideIds(payload?.slideId)
      };

    case "presentation/changePresentationTitle":
      return {
        slideId: normalizeSlideIds(state.selection.currentSlideId)
      };

    case "presentation/changeSlidePositions":
      return {
        slideId: normalizeSlideIds(payload?.slideIds)
      };

    default:
      return {
        slideId: normalizeSlideIds(state.selection.currentSlideId),
        elementIds: state.selection.selectedElementIds.length > 0
          ? [...state.selection.selectedElementIds]
          : undefined
      };
  }
}

function applySnapshotAndContext(
  storeAPI: any,
  snapshot: Snapshot,
  ctx: ActionContext | null,
) {
  isExecutingFromHistory = true;
  try {
    storeAPI.dispatch(restoreState({
      title: snapshot.presentation.title,
      slides: snapshot.slides
    }));

    const stateAfterRestore = storeAPI.getState() as RootState;

    let slideIdsToSelect: string[] = [];

    if (ctx?.slideId?.length) {
      const existingSlides = new Set(
        stateAfterRestore.presentation.slides.map((s: any) => s.id)
      );
      slideIdsToSelect = ctx.slideId.filter(id => existingSlides.has(id));
    }

    if (slideIdsToSelect.length === 0 && snapshot.selection.currentSlideId.length > 0) {
      const existingSlides = new Set(
        stateAfterRestore.presentation.slides.map((s: any) => s.id)
      );
      slideIdsToSelect = snapshot.selection.currentSlideId.filter(id => existingSlides.has(id));
    }

    if (slideIdsToSelect.length === 0 && stateAfterRestore.presentation.slides.length > 0) {
      slideIdsToSelect = [stateAfterRestore.presentation.slides[0].id];
    }

    let elementIdsToSelect: string[] = [];
    if (slideIdsToSelect.length > 0 && ctx?.elementIds?.length) {
      elementIdsToSelect = filterExistingElementIds(
        stateAfterRestore,
        slideIdsToSelect[0],
        ctx.elementIds
      );
    }

    if (slideIdsToSelect.length > 0) {
      storeAPI.dispatch(selectSlide(slideIdsToSelect));
    }

    if (elementIdsToSelect.length > 0) {
      storeAPI.dispatch(selectElements(elementIdsToSelect));
    } else {
      storeAPI.dispatch(clearSelection());
    }

    if (slideIdsToSelect.length > 0) {
      storeAPI.dispatch(
        setLastActionContext({
          slideId: slideIdsToSelect,
          elementIds: elementIdsToSelect.length > 0 ? elementIdsToSelect : undefined,
        }),
      );
    }
  } finally {
    isExecutingFromHistory = false;
  }
}

function filterExistingElementIds(state: RootState, slideId: string, elementIds?: string[]) {
  if (!slideId || !elementIds?.length) return [];
  const slide = state.presentation.slides.find((s: any) => s.id === slideId);
  if (!slide) return [];
  const set = new Set(slide.elements.map((e: any) => e.id));
  return elementIds.filter((id) => set.has(id));
}