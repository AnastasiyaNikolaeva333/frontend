import styles from "./headPresentation.module.css";
import { MyButton } from "../Button/Buttons";
import { useAppSelector, useAppDispatch } from '../../utils/hooks/redux';
import { changePresentationTitle } from "../../store/action-creators"; 

type HeaderPresentationProps = {
  onSave: () => void;
};

function HeaderPresentation(props: HeaderPresentationProps) {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.title);

  const changeTitle = (newTitle: string) => {
    dispatch(changePresentationTitle(newTitle));
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
          defaultValue={title}
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