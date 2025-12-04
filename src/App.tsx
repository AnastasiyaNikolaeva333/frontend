import { HeaderPresentation } from "./view/Presentation/HeadPresentation";
import { SlidesPanel } from "./view/Slide/SlidesPanel/SlidesPanel";
import { CurrentSlide } from "./view/Slide/CurrentSlide/CurrentSlide";
import { Toolbar } from "./view/Button/Toolbar";
import styles from "./App.module.css";
import { saveTitle } from "./utils/function/functionPresentation";

function App() {
  return (
    <div>
      <HeaderPresentation onSave={saveTitle} />

      <Toolbar mode="main" />

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
  );
}

export default App;