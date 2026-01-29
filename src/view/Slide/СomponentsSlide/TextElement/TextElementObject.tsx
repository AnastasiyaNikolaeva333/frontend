import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TextElement } from "../../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks/redux";
import { useSelection } from "../useSelection";
import styles from "./TextElementObject.module.css";
import { useElementPosition } from "../useElementPosition";
import { useResize } from "../../../../utils/hooks/useResize";
import { updateTextContent } from "../../../../store";

type TextElementProps = {
  element: TextElement;
  onClick: (element: TextElement) => void;
  isSelected?: boolean;
  isInGroup?: boolean;
  isGroupDragging?: boolean;
  dragDelta?: { x: number; y: number };
  onDragStart?: (startX: number, startY: number) => void;
  onDrag?: (deltaX: number, deltaY: number) => void;
  onDragEnd?: () => void;
};

function TextElementObject(props: TextElementProps) {
  const dispatch = useAppDispatch();
  const { handleElementClick, isActive } = useSelection(props.element);
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(props.element.content);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const currentSlideId = useAppSelector((state) => state.selection.currentSlideId);

  const { 
    isDragging, 
    elementStyle, 
    onMouseDown,
  } = useElementPosition(
    props.element,
    props.isSelected && !props.isInGroup ? props.onDrag : undefined,
    props.isSelected && !props.isInGroup ? props.onDragEnd : undefined
  );

  const { isResizing, width, height, position, onResizeStart } = useResize({
    elementId: props.element.id,
    startWidth: props.element.sizes.width,
    startHeight: props.element.sizes.height,
    startX: props.element.position.x,
    startY: props.element.position.y,
    elementType: 'text',
    disabled: !props.isSelected || props.isInGroup
  });

  useEffect(() => {
    setLocalContent(props.element.content);
  }, [props.element.content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const textStyle = useMemo((): React.CSSProperties => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${isResizing ? position.x : props.element.position.x}px`,
      top: `${isResizing ? position.y : props.element.position.y}px`,
      width: `${isResizing ? width : props.element.sizes.width}px`,
      height: `${props.element.sizes.height}px`,
      fontFamily: props.element.style.fontFamily,
      fontSize: `${props.element.style.fontSize}px`,
      fontWeight: props.element.style.fontWeight,
      fontStyle: props.element.style.fontStyle,
      color: props.element.style.color.color,
      padding: '8px',
      boxSizing: 'border-box',
      zIndex: isEditing || isActive ? 100 : "auto",
    };

    if (isEditing) {
      style.height = `${props.element.sizes.height}px`;
    } else {
      style.height = `${isResizing ? height : props.element.sizes.height}px`;
    }

    if (props.isInGroup && props.isGroupDragging && props.dragDelta) {
      style.transform = `translate(${props.dragDelta.x}px, ${props.dragDelta.y}px)`;
      style.opacity = 0.8;
      style.pointerEvents = 'none';
    } else if (props.isInGroup || !props.isSelected) {
      style.pointerEvents = 'auto';
      style.cursor = 'default';
    } else if (props.isSelected && !props.isInGroup) {
      if (isDragging) {
        const currentElementStyle = elementStyle();
        style.left = currentElementStyle.left;
        style.top = currentElementStyle.top;
        style.cursor = currentElementStyle.cursor;
        style.userSelect = currentElementStyle.userSelect;
      } else {
        style.cursor = 'move';
      }
    }

    return style;
  }, [
    props, 
    elementStyle, 
    isResizing, 
    width, 
    height, 
    position,
    isEditing, 
    isActive,
    isDragging
  ]);

  const elementClasses = useMemo(() =>
    `
      ${styles.textElement}
      ${isActive ? styles.active : ""} 
      ${isDragging ? styles.dragging : ""} 
      ${isResizing ? styles.resizing : ""}
    `,
    [isActive, isDragging, isResizing]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation();
      return;
    }

    const isResizeHandle = (e.target as HTMLElement).classList.contains(styles.resizeHandle);
    
    if (isResizeHandle) return;

    if (props.isInGroup || !props.isSelected) {
      e.stopPropagation();
      return;
    }

    if (isActive && props.onDragStart) {
      props.onDragStart(e.clientX, e.clientY);
    }
    
    onMouseDown(e);
  }, [isEditing, isActive, onMouseDown, props]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if ((e.target as HTMLElement).classList.contains(styles.resizeHandle)) return;
    
    handleElementClick();
    props.onClick(props.element);

    if (e.detail === 2 && props.isSelected && !props.isInGroup) {
      setIsEditing(true);
    }
  }, [props, handleElementClick]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsEditing(false);
    if (currentSlideId && localContent !== props.element.content) {
      dispatch(updateTextContent({
        slideId: currentSlideId,
        elementId: props.element.id,
        newText: localContent
      }));
    }
  }, [currentSlideId, localContent, props.element.content, props.element.id, dispatch]);

  const handleTextareaKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalContent(props.element.content);
      e.currentTarget.blur();
    } 
  }, [currentSlideId, localContent, props.element.content, props.element.id, dispatch]);

  const handleTextareaMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const resizeHandles = useMemo(() => {
    if (!isActive || isEditing || isResizing || !props.isSelected || props.isInGroup) return null;

    const elementWidth = isResizing ? width : props.element.sizes.width;
    const elementHeight = isResizing ? height : props.element.sizes.height;

    const handles = [
      { direction: 'top-left' as const, x: -4, y: -4 },
      { direction: 'top-right' as const, x: elementWidth - 4, y: -4 },
      { direction: 'bottom-left' as const, x: -4, y: elementHeight - 4 },
      { direction: 'bottom-right' as const, x: elementWidth - 4, y: elementHeight - 4 },

      { direction: 'top' as const, x: elementWidth / 2 - 4, y: -4 },
      { direction: 'bottom' as const, x: elementWidth / 2 - 4, y: elementHeight - 4 },
      { direction: 'left' as const, x: -4, y: elementHeight / 2 - 4 },
      { direction: 'right' as const, x: elementWidth - 4, y: elementHeight / 2 - 4 },
    ];

    return handles.map(({ direction, x, y }) => (
      <div
        key={direction}
        className={styles.resizeHandle}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: '8px',
          height: '8px',
          backgroundColor: '#1a73e8',
          border: '1px solid white',
          borderRadius: direction.includes('top') || direction.includes('bottom') ? '0' : '1px',
          cursor: `${direction}-resize`,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onResizeStart(e, direction);
        }}
      />
    ));
  }, [isActive, isEditing, isResizing, width, height, props.element.sizes, onResizeStart, props.isSelected, props.isInGroup]);

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        style={{
          ...textStyle
        }}
        className={`${styles.textElement} ${styles.editing}`}
        placeholder="Введите текст"
        value={localContent}
        onChange={handleTextareaChange}
        onBlur={handleInputBlur}
        onKeyDown={handleTextareaKeyDown}
        onMouseDown={handleTextareaMouseDown}
      />
    );
  }

  return (
    <div
      style={textStyle}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={elementClasses}
    >
      <div
        className={styles.textContent}
      >
        {props.element.content || "Введите текст"}
      </div>
      {resizeHandles}
    </div>
  );
}

export { TextElementObject };