import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/redux";
import { undo, redo } from "../../../store";

interface KeyboardShortcutsProps {
  children?: React.ReactNode;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { canUndo, canRedo } = useAppSelector((state) => state.undoRedo);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          (target as any).isContentEditable);

      if (isTyping) return;

      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      const isUndoKey = e.code === "KeyZ" && !e.shiftKey;
      const isRedoKey = e.code === "KeyY" || (e.code === "KeyZ" && e.shiftKey);

      if (isUndoKey) {
        e.preventDefault();
        e.stopPropagation();
        if (canUndo) dispatch(undo());
        return;
      }

      if (isRedoKey) {
        e.preventDefault();
        e.stopPropagation();
        if (canRedo) dispatch(redo());
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [dispatch, canUndo, canRedo]);

  return <>{children}</>;
};

export default KeyboardShortcuts;
