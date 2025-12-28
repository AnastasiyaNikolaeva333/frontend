// store/history/undoRedo.ts
export type ActionContext = {
  slideId: string | null;
  elementIds?: string[];
};

export type Action = {
  do: () => void;
  undo: () => void;
  context?: ActionContext;
};

export function createUndoStack() {
  const past: Action[] = [];
  const future: Action[] = [];

  return {
    push(action: Action) {
      past.push(action);
      future.length = 0; 
    },

    undo(): Action['context'] | null {
      const action = past.pop();
      if (action) {
        action.undo();
        future.unshift(action);
        return action.context || null;
      }
      return null;
    },

    redo(): Action['context'] | null {
      const action = future.shift();
      if (action) {
        action.do();
        past.push(action);
        return action.context || null;
      }
      return null;
    },

    get canUndo() {
      return past.length > 0;
    },

    get canRedo() {
      return future.length > 0;
    },

    clear() {
      past.length = 0;
      future.length = 0;
    },
    
    getPastLength() {
      return past.length;
    },
    
    getFutureLength() {
      return future.length;
    }
  };
}

export type UndoStack = ReturnType<typeof createUndoStack>;