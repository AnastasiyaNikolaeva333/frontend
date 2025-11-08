import { dispatch } from "../../editor";
import { updateTextContent, selectElements, deselectElements, updateElementPosition } from "../../utils/function/functionElementsSlide";
import { useDnd } from "../../utils/function/useDnd";
import type { Presentation, SlideElement } from "../../types/presentationTypes";
import styles from "./componentsSlide.module.css";
import { useEffect, useRef, useState } from "react";

type ComponentsSlideProps = {
  presentation: Presentation;
  element: SlideElement;
  onClick: (element: SlideElement) => void;
};

function ComponentsSlide(props: ComponentsSlideProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focused, setFocused] = useState<boolean>(props.presentation.selected.selectedElementIds.has(props.element.id));

  if (props.element.id === 'maximal-text-1') {
    console.log(focused);
  }

  const changeText = (newText: string) => {
    selectElements(props.presentation, [props.element.id]);
    dispatch(updateTextContent, { newText, elementId: props.element.id });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    changeText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      dispatch(deselectElements, [props.element.id]);
    }
  };

  const handleClick = () => {
    if (props.element.type == "text") {
      selectElements(props.presentation, [props.element.id]);
    } else {
      dispatch(selectElements, [props.element.id]);
    }
    props.onClick(props.element);
  };


  const startX = typeof props.element.position.x === 'string'
    ? parseFloat(props.element.position.x)
    : props.element.position.x;

  const startY = typeof props.element.position.y === 'string'
    ? parseFloat(props.element.position.y)
    : props.element.position.y;

  const {
    isDragging,
    top,
    left,
    onMouseDown,
  } = useDnd({
    startX: startX,
    startY: startY,
    onFinish: (newX: number, newY: number) => {
      selectElements(props.presentation, [props.element.id]);
      dispatch(updateElementPosition, {
        elementId: props.element.id,
        newPosition: { x: newX, y: newY }
      });
      console.log('focused');
      inputRef.current?.select();
    }
  });

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: isDragging ? left : startX,
    top: isDragging ? top : startY,
    width: props.element.sizes.width,
    height: props.element.sizes.height,
    userSelect: isDragging ? 'none' : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const isActive = props.presentation.selected.selectedElementIds.has(props.element.id);

  const commonProps = {
    style: baseStyle,
    onMouseDown: onMouseDown,
    //onClick: handleClick,
    className: `${isActive ? styles.active : ""} ${isDragging ? styles.dragging : ""}`
  };

  if (props.element.type === "text") {
    const textStyle: React.CSSProperties = {
      ...baseStyle,
      fontFamily: props.element.style.fontFamily,
      fontSize: props.element.style.fontSize,
      fontWeight: props.element.style.fontWeight,
      fontStyle: props.element.style.fontStyle,
      color: props.element.style.color.color,
    };

    return (
      <input
        type="text"
        ref={inputRef}
        {...commonProps}
        style={textStyle}
        className={`${styles.textElement} ${commonProps.className}`}
        placeholder="Введите текст"
        defaultValue={props.element.content}
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
      />
    );
  }

  return (
    <img
      {...commonProps}
      className={`${styles.imageElement} ${commonProps.className}`}
      src={props.element.src}
      alt="Изображение"
    />
  );
}

export {
  ComponentsSlide,
} 