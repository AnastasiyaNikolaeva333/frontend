import type { ImageElement } from "../../../types/presentationTypes";
import { useSelection } from "./useSelection";
import { useElementPosition } from "./useElementPosition";
import { useResize } from "../../../utils/hooks/useResize";
import styles from "./componentsSlide.module.css";
import { useMemo } from "react";
import { useGlobalMouseHandlers } from "../../../utils/hooks/useGlobalMouseHandlers";

type ImageElementProps = {
  element: ImageElement;
  onClick: (element: ImageElement) => void;
  onDragStart?: (startX: number, startY: number) => void;
  onDrag?: (currentX: number, currentY: number) => void;
  onDragEnd?: () => void;
};

function ImageElementObject(props: ImageElementProps) {
  const { handleElementClick, isActive } = useSelection(props.element);
  const { isDragging, elementStyle, onMouseDown } = useElementPosition(props.element);

  const {
    isResizing,
    width,
    height,
    onResizeStart
  } = useResize({
    elementId: props.element.id,
    startWidth: props.element.sizes.width,
    startHeight: props.element.sizes.height,
    elementType: 'image'
  });


  useGlobalMouseHandlers(
    isDragging ? (e: MouseEvent) => {
      props.onDrag?.(e.clientX, e.clientY);
    } : undefined,
    isDragging ? () => {
      props.onDragEnd?.();
    } : undefined,
    isDragging
  );

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: isDragging ? elementStyle.left : `${props.element.position.x}px`,
    top: isDragging ? elementStyle.top : `${props.element.position.y}px`,
    width: isResizing ? `${width}px` : `${props.element.sizes.width}px`,
    height: isResizing ? `${height}px` : `${props.element.sizes.height}px`,
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    cursor: isDragging ? 'grabbing' : 'grab',
    objectFit: 'fill',
    userSelect: 'none',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleElementClick();
    props.onClick(props.element);
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    props.onDragStart?.(e.clientX, e.clientY);
    onMouseDown(e);
  };

  const resizeHandles = useMemo(() => {
    if (!isActive ) return null;

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
          e.stopPropagation();
          onResizeStart(e, direction);
        }}
      />
    ));
  }, [isActive, isResizing, width, height, props.element.sizes, onResizeStart]);

  return (
    <div
      style={containerStyle}
      onClick={handleClick}
      onMouseDown={handleContainerMouseDown}
      className={`${styles.imageContainer} ${isActive ? styles.active : ""} ${isDragging ? styles.dragging : ""} ${isResizing ? styles.resizing : ""}`}
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