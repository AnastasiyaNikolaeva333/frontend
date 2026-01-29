import React from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks/redux";
import { undo, redo } from "../../store";
import { MyButton } from "./Buttons";
import styles from "./UndoRedoButtons.module.css";

const UndoRedoButtons: React.FC = () => {
  const dispatch = useAppDispatch();
  const { canUndo, canRedo } = useAppSelector((state) => state.undoRedo);

  return (
    <div className={styles.container}>
      <MyButton
        onClick={() => dispatch(undo())}
        disabled={!canUndo}
        title="Отменить (Ctrl+Z / Cmd+Z)"
        variant="primary"
        size="medium"
        className={`${styles.button} ${canUndo ? styles.enabled : styles.disabled}`}
      >
        <span className={styles.icon}>↶</span>
        Undo
      </MyButton>

      <MyButton
        onClick={() => dispatch(redo())}
        disabled={!canRedo}
        title="Повторить (Ctrl+Y / Cmd+Y или Ctrl+Shift+Z / Cmd+Shift+Z)"
        variant="primary"
        size="medium"
        className={`${styles.button} ${canRedo ? styles.enabled : styles.disabled}`}
      >
        <span className={styles.icon}>↷</span>
        Redo
      </MyButton>
    </div>
  );
};

export default UndoRedoButtons;