import React from 'react';
import { renderSlideBackground } from "../BackroundSlide";
import type { Slide, SlideElement } from '../../../types/presentationTypes';
import styles from "./slidesPanel.module.css";

interface SlideThumbnailContentProps {
  slide: Slide;
  scale: number;
}

// Упрощенные компоненты для отображения элементов на миниатюре
const SimplifiedTextElement: React.FC<{
  element: any;
  scale: number;
}> = ({ element }) => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: `${element.sizes.width}px`,
    height: `${element.sizes.height}px`,
    fontFamily: element.style?.fontFamily || 'Arial',
    fontSize: `${element.style?.fontSize || 14}px`,
    fontWeight: element.style?.fontWeight || 'normal',
    fontStyle: element.style?.fontStyle || 'normal',
    color: element.style?.color?.color || '#000000',
    padding: '4px',
    boxSizing: 'border-box',
    pointerEvents: 'none',
    userSelect: 'none',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={style}>
      {element.content || "Текст"}
    </div>
  );
};

const SimplifiedImageElement: React.FC<{
  element: any;
  scale: number;
}> = ({ element }) => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: `${element.sizes.width}px`,
    height: `${element.sizes.height}px`,
    pointerEvents: 'none',
    userSelect: 'none',
    overflow: 'hidden',
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div style={style}>
      <img
        src={element.src}
        alt="Изображение"
        style={imgStyle}
        draggable={false}
      />
    </div>
  );
};

export const SlideThumbnailContent = React.memo(({ slide, scale }: SlideThumbnailContentProps) => {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        pointerEvents: "none",
      }}
    >
      <div
        className={styles.thumbnailSlide}
        style={renderSlideBackground(slide.background)}
      >
        {slide.elements?.map((element: SlideElement) => {
          return element.type === "text" ? (
            <SimplifiedTextElement 
              key={element.id} 
              element={element}
              scale={scale}
            />
          ) : (
            <SimplifiedImageElement 
              key={element.id} 
              element={element}
              scale={scale}
            />
          );
        })}
      </div>
    </div>
  );
});