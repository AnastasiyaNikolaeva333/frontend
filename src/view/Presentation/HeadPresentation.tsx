import type { Presentation } from "../../types/presentationTypes";
import styles from "./headPresentation.module.css";
import { MyButton } from "../Button/Buttons";
import { dispatch } from "../../editor";
import { renamePresentation } from "../../utils/function/functionPresentation";

type HeaderPresentationProps = {
  presentation: Presentation;
  onSave: () => void;
};

function HeaderPresentation(props: HeaderPresentationProps) {

  const changeTitle = (newTitle: string) => {
    dispatch(renamePresentation, newTitle);
    console.log("Новое название презентации:", newTitle);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeTitle(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <header className={styles.presentationHeader}>
      <div className={styles.headerContent}>
        <img className={styles.logoIcon} src="src/assets/logotip.png" alt="Логотип" />
        <input
          type="text"
          className={styles.presentationTitle}
          defaultValue={props.presentation.title}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
          placeholder="Название презентации"
        />
      </div>
      <div>
        <MyButton onClick={props.onSave}>
          <img className={styles.logoIcon} src="src/assets/savePresentation.png" alt="Сохранить" />
        </MyButton>
      </div>
    </header>
  );
}

export { HeaderPresentation };