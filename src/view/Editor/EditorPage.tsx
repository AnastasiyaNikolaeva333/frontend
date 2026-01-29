import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { HeaderPresentation } from "../Presentation/HeadPresentation";
import { SlidesPanel } from "../Slide/SlidesPanel/SlidesPanel";
import { CurrentSlide } from "../Slide/CurrentSlide/CurrentSlide";
import { Toolbar } from "../Button/Toolbar";
import UndoRedoButtons from "../Button/UndoRedoButtons";
import { MyButton } from "../Button/Buttons";

import KeyboardShortcuts from "../Slide/СomponentsSlide/KeyboardShortcuts";

import styles from "../../App.module.css";
import { useAppDispatch, useAppSelector } from "../../utils/hooks/redux";
import { setCanRedo, setCanUndo } from "../../store/history/undoRedoSlice";
import { undoStack } from "../../store/history/undoStackInstance";
import { selectCurrentSlide } from "../../store";

function UndoRedoInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCanUndo(undoStack.canUndo));
    dispatch(setCanRedo(undoStack.canRedo));
  }, [dispatch]);

  return null;
}

export default function EditorPage() {
  const navigate = useNavigate();

  const currentSlide = useAppSelector(selectCurrentSlide);
  
  if (!currentSlide?.id) {
    return ;
  }

  return (
    <KeyboardShortcuts>
      <UndoRedoInitializer />

      <div>
        <HeaderPresentation/>

        <div className={styles.toolbarContainer}>
          <UndoRedoButtons />

          <MyButton
            onClick={() => navigate("/player")}
            title="Открыть режим слайд-шоу"
            variant="success"
            size="medium"
            style={{ margin: "12px" }}
          >
            ▶ Слайд-шоу
          </MyButton>
        </div>

        <div className={styles.mainContent}>
          <SlidesPanel />
          <div className={styles.workspace}>
            <Toolbar mode="workspace" />
            <div className={styles.slideArea}>
              <CurrentSlide onElementClick={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </KeyboardShortcuts>
  );
}