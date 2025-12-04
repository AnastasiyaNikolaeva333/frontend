import type { TextElement } from "../../../types/presentationTypes";
import { useElementPosition } from "./useElementPosition";
import { useResize } from "../../../utils/hooks/useResize";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { updateTextContent, selectElements } from "../../../store/action-creators/elements";
import styles from "./componentsSlide.module.css";
import { useAppDispatch } from "../../../utils/hooks/redux";
import { useAppSelector } from "../../../hooks";

type TextElementProps = {
  element: TextElement;
  onClick: (element: TextElement) => void;
  onDragStart?: (startX: number, startY: number) => void;
  onDrag?: (currentX: number, currentY: number) => void;
  onDragEnd?: () => void;
};

function TextElementObject(props: TextElementProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(props.element.content);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragTimerRef = useRef<number | null>(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<number | null>(null);

  const { isDragging, elementStyle, onMouseDown } = useElementPosition(props.element);
  const { isResizing, width, height, onResizeStart } = useResize({
    elementId: props.element.id,
    startWidth: props.element.sizes.width,
    startHeight: props.element.sizes.height,
    elementType: 'text'
  });

  const selectedElementIds = useAppSelector((state) => state.selected.selectedElementIds);
  const currentSlideId = useAppSelector((state) => state.selected.currentSlideId);
  const isActive = selectedElementIds.has(props.element.id);

  useEffect(() => {
    setLocalContent(props.element.content);
  }, [props.element.content]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        props.onDrag?.(e.clientX, e.clientY);
      };

      const handleMouseUp = () => {
        props.onDragEnd?.();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, props]);

  const textStyle = useMemo((): React.CSSProperties => ({
    ...elementStyle,
    width: isResizing ? `${width}px` : `${props.element.sizes.width}px`,
    height: isResizing ? `${height}px` : `${props.element.sizes.height}px`,
    fontFamily: props.element.style.fontFamily,
    fontSize: `${props.element.style.fontSize}px`,
    fontWeight: props.element.style.fontWeight,
    fontStyle: props.element.style.fontStyle,
    color: props.element.style.color.color,
    cursor: isDragging ? 'grabbing' : (isEditing ? 'text' : 'grab'),
    padding: '8px',
    boxSizing: 'border-box',
    position: 'absolute',
    zIndex: isEditing || isActive ? 100 : "auto",
    backgroundColor: isResizing ? 'rgba(26, 115, 232, 0.1)' : 'transparent',
    border: isResizing ? '1px dashed #1a73e8' : 'none',
  }), [elementStyle, isResizing, width, height, props.element.style, props.element.sizes, isDragging, isEditing, isActive]);

  const elementClasses = useMemo(() =>
    `${styles.textElement} ${isActive ? styles.active : ""} ${isDragging ? styles.dragging : ""} ${isResizing ? styles.resizing : ""}`,
    [isActive, isDragging, isResizing]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation();
      return;
    }

    const isResizeHandle = (e.target as HTMLElement).classList.contains(styles.resizeHandle);
    if (!isResizeHandle) {
      props.onDragStart?.(e.clientX, e.clientY);
      
      dragTimerRef.current = window.setTimeout(() => {
        onMouseDown(e);
        dragTimerRef.current = null;
      }, 200);
    }
  }, [isEditing, onMouseDown, props]);

  const handleMouseUp = useCallback(() => {
    dragTimerRef.current && clearTimeout(dragTimerRef.current);
    dragTimerRef.current = null;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if ((e.target as HTMLElement).classList.contains(styles.resizeHandle)) return;

    clickCountRef.current++;

    if (clickCountRef.current === 1) {
      clickTimerRef.current = window.setTimeout(() => {
        handleMouseUp();
        dispatch(selectElements([props.element.id]));
        props.onClick(props.element);
        clickCountRef.current = 0;
      }, 300);
    } else {
      clickTimerRef.current && clearTimeout(clickTimerRef.current);
      handleMouseUp();
      setIsEditing(true);
      dispatch(selectElements([props.element.id]));
      props.onClick(props.element);
      clickCountRef.current = 0;
    }
  }, [handleMouseUp, props, dispatch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalContent(e.target.value);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsEditing(false);
    if (currentSlideId && localContent !== props.element.content) {
      dispatch(updateTextContent(currentSlideId, props.element.id, localContent));
    }
  }, [currentSlideId, localContent, props.element.content, props.element.id, dispatch]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (currentSlideId && localContent !== props.element.content) {
        dispatch(updateTextContent(currentSlideId, props.element.id, localContent));
      }
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalContent(props.element.content);
      e.currentTarget.blur();
    }
  }, [currentSlideId, localContent, props.element.content, props.element.id, dispatch]);

  const handleInputMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const resizeHandles = useMemo(() => {
    if (!isActive || isEditing) return null;

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
  }, [isActive, isEditing, isResizing, width, height, props.element.sizes, onResizeStart]);

  useEffect(() => () => {
    dragTimerRef.current && clearTimeout(dragTimerRef.current);
    clickTimerRef.current && clearTimeout(clickTimerRef.current);
  }, []);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        style={textStyle}
        className={`${styles.textElement} ${styles.editing}`}
        placeholder="Введите текст"
        value={localContent}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        onMouseDown={handleInputMouseDown}
        autoFocus
      />
    );
  }

  return (
    <div
      style={textStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      className={elementClasses}
    >
      <div className={styles.textContent}>
        {props.element.content || "Введите текст"}
      </div>
      {resizeHandles}
    </div>
  );
}

export { TextElementObject };