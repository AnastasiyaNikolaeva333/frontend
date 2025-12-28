// App.tsx
import { Provider } from 'react-redux';
import { store } from './store';
import { HeaderPresentation } from "./view/Presentation/HeadPresentation";
import { SlidesPanel } from "./view/Slide/SlidesPanel/SlidesPanel";
import { CurrentSlide } from "./view/Slide/CurrentSlide/CurrentSlide";
import { Toolbar } from "./view/Button/Toolbar";
import styles from "./App.module.css";
import { saveTitle } from "./utils/function/functionPresentation";
import UndoRedoButtons from './view/Button/UndoRedoButtons';
import KeyboardShortcuts from './view/Slide/СomponentsSlide/KeyboardShortcuts';
import { useEffect } from 'react';
import { useAppDispatch } from './utils/hooks/redux';
import { setCanRedo, setCanUndo } from './store/history/undoRedoSlice';
import { undoStack } from './store/history/undoStackInstance';

export const UndoRedoInitializer = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(setCanUndo(undoStack.canUndo));
    dispatch(setCanRedo(undoStack.canRedo));
  }, [dispatch]);
  
  return null;
};

function App() {
  return (
    <Provider store={store}>
      <KeyboardShortcuts>
        <UndoRedoInitializer />
        <div>
          <HeaderPresentation onSave={saveTitle} />

          <div className={styles.toolbarContainer}>
            <UndoRedoButtons />
            <Toolbar mode="main" />
          </div>

          <div className={styles.mainContent}>
            <SlidesPanel />
            <div className={styles.workspace}>
              <Toolbar mode="workspace" />
              <div className={styles.slideArea}>
                <CurrentSlide onElementClick={() => { }} />
              </div>
            </div>
          </div>
        </div>
      </KeyboardShortcuts>
    </Provider>
  );
}

export default App;