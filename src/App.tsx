import type { Presentation } from "./types/presentationTypes";
import { HeaderPresentation } from "./view/Presentation/HeadPresentation";
import { SlidesPanel } from "./view/Slide/SlidesPanel";
import { CurrentSlide } from "./view/Slide/CurrentSlide";
import { Toolbar } from "./view/Button/Toolbar";
import styles from "./App.module.css";
import { handleSlideClick } from "./utils/function/functionSlide";
import { saveTitle } from "./utils/function/functionPresentation";
import { handleElementClick } from "./utils/function/functionElementsSlide";

type AppProps = {
  editor: Presentation;
};

function App(props: AppProps) {
  return (
    <div>
      <HeaderPresentation
        presentation={props.editor}
        onSave={saveTitle}
      />

      <Toolbar
        presentation={props.editor}
        mode="main"
      />

      <div className={styles.mainContent}>
        <SlidesPanel
          presentation={props.editor}
          onSlideClick={handleSlideClick}
        />

        <div className={styles.workspace}>
          <Toolbar presentation={props.editor} mode="workspace" />
          <div className={styles.slideArea}>
            <CurrentSlide
              presentation={props.editor}
              onElementClick={handleElementClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;