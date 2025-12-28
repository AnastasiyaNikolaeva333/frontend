import React, { useMemo } from 'react';
import type { Position, Size } from '../../../../types/presentationTypes';
import styles from './selectionContainer.module.css';

type SelectionContainerProps = {
  selectedElements: Array<{
    id: string;
    position: Position;
    sizes: Size;
  }>;
  dragDelta?: { x: number; y: number };
  isDragging: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
}

function SelectionContainer({ selectedElements, dragDelta, isDragging, onMouseDown }: SelectionContainerProps) {
  const containerBounds = useMemo(() => {
    if (selectedElements.length === 0) return null;

    let minX = Infinity, minY = Infinity;
    let maxX = 0, maxY = 0;

    selectedElements.forEach(element => {
      minX = Math.min(minX, element.position.x);
      minY = Math.min(minY, element.position.y);
      maxX = Math.max(maxX, element.position.x + element.sizes.width);
      maxY = Math.max(maxY, element.position.y + element.sizes.height);
    });

    return {
      x: minX,
      y: minY,
      width: (maxX - minX),
      height: (maxY - minY)
    };
  }, [selectedElements]);

  if (!containerBounds || selectedElements.length <= 1) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${containerBounds.x + (dragDelta?.x || 0)}px`,
    top: `${containerBounds.y + (dragDelta?.y || 0)}px`,
    width: `${containerBounds.width}px`,
    height: `${containerBounds.height}px`,
    border: '2px dashed #4285f4',
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    pointerEvents: onMouseDown ? 'auto' : 'none',
    cursor: onMouseDown ? (isDragging ? 'grabbing' : 'grab') : 'default',
    zIndex: 1000,
    boxSizing: 'border-box',
    opacity: isDragging ? 0.8 : 1
  };

  return (
    <div
      className={styles.selectionContainer}
      style={style}
      onMouseDown={onMouseDown}
    />
  );
}

export { SelectionContainer };