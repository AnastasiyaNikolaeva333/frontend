import stylesToolBar from "./toolbar.module.css";
import stylesButton from "./buttons.module.css";
import { MyButton } from "./Buttons";
import type { Presentation } from "../../types/presentationTypes";
import { handleToolbarAction } from "../../utils/function/functionToolbar";

type ToolbarProps = {
  presentation: Presentation;
  mode?: "main" | "workspace" | "slidesPanel";
};

function Toolbar(props: ToolbarProps) {
  const toolbarConfig = {
    main: [
      { text: "Файл", action: "file" },
      { text: "Правка", action: "correction" },
      { text: "Вид", action: "view" },
      { text: "Вставка", action: "insert" },
      { text: "Формат", action: "format" },
      { text: "Слайд", action: "slide" },
    ],
    workspace: [
      { text: "Добавить текст", action: "add-text" },
      { text: "Добавить изображение", action: "add-image" },
      { text: "Изменить фон", action: "change-background" },
      { text: "Удалить элемент", action: "remove-element" },
    ],
    slidesPanel: [
      { text: "+", action: "add-slide", title: "Добавить слайд" },
      { text: "×", action: "remove-slide", title: "Удалить слайд" },
    ],
  };

  const items = toolbarConfig[props.mode || "main"];
  const toolbarClass =
    props.mode === "workspace"
      ? `${stylesToolBar.toolbar} ${stylesToolBar.workspaceToolbar}`
      : props.mode === "slidesPanel"
        ? `${stylesButton.myButton}`
        : stylesToolBar.toolbar;

  return (
    <div className={toolbarClass}>
      {items.map((item) =>
        props.mode === "slidesPanel" ? (
          <MyButton
            key={item.text}
            onClick={() => handleToolbarAction(item.action, props.presentation)}
          >
            {item.text}
          </MyButton>
        ) : (
          <MyButton
            key={item.text}
            text={item.text}
            onClick={() => handleToolbarAction(item.action, props.presentation)}
          />
        )
      )}
    </div>
  );
}

export { Toolbar };