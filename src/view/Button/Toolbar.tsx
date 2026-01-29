import stylesToolBar from "./toolbar.module.css";
import stylesButton from "./buttons.module.css";
import { MyButton } from "./Buttons";
import { useToolbarActions } from "../../utils/function/functionToolbar";

type ToolbarProps = {
  mode?: "workspace" | "slidesPanel";
};

function Toolbar(props: ToolbarProps) {
  const handleToolbarAction = useToolbarActions();

  const toolbarConfig = {
    workspace: [
      { text: "Добавить текст", action: "add-text" },
      { text: "Добавить изображение", action: "add-image" },
      { text: "Изменить фон", action: "change-background" },
      { text: "Удалить элемент", action: "remove-element" },
    ],
    slidesPanel: [
      { text: "+", action: "add-slide", title: "Добавить слайд" },
      { text: "×", action: "remove-slides", title: "Удалить слайд" },
    ],
  };

  const items = toolbarConfig[props.mode || "workspace"];
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
            onClick={() => handleToolbarAction(item.action)}
          >
            {item.text}
          </MyButton>
        ) : (
          <MyButton
            key={item.text}
            text={item.text}
            onClick={() => handleToolbarAction(item.action)}
          />
        )
      )}
    </div>
  );
}

export { Toolbar };