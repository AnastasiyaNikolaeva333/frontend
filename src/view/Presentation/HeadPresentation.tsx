import styles from "./headPresentation.module.css";
import { useAppSelector, useAppDispatch } from '../../utils/hooks/redux';
import { changePresentationTitle, selectPresentationTitle } from "../../store";
import { useEffect, useState } from "react";

function HeaderPresentation() {
  const dispatch = useAppDispatch();
  const title = useAppSelector(selectPresentationTitle);
  
  const [editingTitle, setEditingTitle] = useState(title);

  useEffect(() => {
    setEditingTitle(title);
  }, [title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleBlur = () => {
    if (editingTitle !== title) {
      dispatch(changePresentationTitle(editingTitle));
    }
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
          value={editingTitle} 
          onChange={handleChange} 
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
          placeholder="Название презентации"
        />
      </div>
    </header>
  );
}

export { HeaderPresentation };