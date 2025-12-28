import type { ImageElement } from "../../../../types/presentationTypes"; 
import { useSelection } from "../useSelection"; 
import { useElementPosition } from "../useElementPosition"; 
import { useResize } from "../../../../utils/hooks/useResize"; 
import styles from "./ImageElementObject.module.css";
import { useCallback, useMemo } from "react";

type ImageElementProps = {
  element: ImageElement;
  onClick: (element: ImageElement) => void;
  isSelected?: boolean;
  isInGroup?: boolean;
  isGroupDragging?: boolean;
  dragDelta?: { x: number; y: number };
  onDragStart?: (startX: number, startY: number) => void;
  onDrag?: (deltaX: number, deltaY: number) => void;
  onDragEnd?: () => void;
};

function ImageElementObject(props: ImageElementProps) {
  const { handleElementClick, isActive } = useSelection(props.element);

  const {
    isDragging,
    elementStyle,
    onMouseDown,
  } = useElementPosition(
    props.element,
    props.isSelected && !props.isInGroup ? props.onDrag : undefined,
    props.isSelected && !props.isInGroup ? props.onDragEnd : undefined
  );

  const {
    isResizing,
    width,
    height,
    position,
    onResizeStart
  } = useResize({
    elementId: props.element.id,
    startWidth: props.element.sizes.width,
    startHeight: props.element.sizes.height,
    startX: props.element.position.x,
    startY: props.element.position.y,
    elementType: 'image',
    disabled: !props.isSelected || props.isInGroup
  });

  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
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
  }, [isActive, onMouseDown, props]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if ((e.target as HTMLElement).classList.contains(styles.resizeHandle)) return;

    handleElementClick();
    props.onClick(props.element);
  }, [props, handleElementClick]);

  const dynamicStyle = useMemo((): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: `${isResizing ? position.x : props.element.position.x}px`,
      top: `${isResizing ? position.y : props.element.position.y}px`,
      width: `${isResizing ? width : props.element.sizes.width}px`,
      height: `${isResizing ? height : props.element.sizes.height}px`,
      zIndex: isActive ? 100 : "auto",
    };

    if (props.isInGroup && props.isGroupDragging && props.dragDelta) {
      baseStyle.transform = `translate(${props.dragDelta.x}px, ${props.dragDelta.y}px)`;
      baseStyle.opacity = 0.8;
      baseStyle.pointerEvents = 'none';
    }

    else if (props.isInGroup || !props.isSelected) {
      baseStyle.pointerEvents = 'auto';
      baseStyle.cursor = 'default';
    }

    else if (props.isSelected && !props.isInGroup) {
      if (isDragging) {
        const currentElementStyle = elementStyle();
        baseStyle.left = currentElementStyle.left;
        baseStyle.top = currentElementStyle.top;
        baseStyle.cursor = currentElementStyle.cursor;
        baseStyle.userSelect = currentElementStyle.userSelect;
      } else {
        baseStyle.cursor = 'move';
      }
    }

    return baseStyle;
  }, [
    props,
    elementStyle,
    isResizing,
    width,
    height,
    position,
    isActive,
    isDragging
  ]);

  const containerClasses = useMemo(() => {
    const classes = [styles.imageContainer];

    if (isActive) classes.push(styles.active);
    if (isDragging) classes.push(styles.dragging);
    if (isResizing) classes.push(styles.resizing);

    return classes.join(' ');
  }, [isActive, isDragging, isResizing]);

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    userSelect: 'none',
  };

  const resizeHandles = useMemo(() => {
    if (!isActive || isResizing || props.isInGroup) return null;

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
          cursor: `${direction}-resize`,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeStart(e, direction);
        }}
      />
    ));
  }, [isActive, isResizing, width, height, props.element.sizes, onResizeStart, props.isInGroup]);

  return (
    <div
      style={dynamicStyle}
      onClick={handleClick}
      onMouseDown={handleContainerMouseDown}
      className={containerClasses}
    >
      <img
        style={imageStyle}
        className={styles.imageElement}
        src={props.element.src}
        alt="Изображение"
        draggable={false}
      />
      {resizeHandles}
    </div>
  );
}

export { ImageElementObject };