import type { Presentation, Slide } from "../../types/presentationTypes";
import { Toolbar } from "../Button/Toolbar"; 
import { renderSlideBackground } from "./BackroundSlide";
import { ComponentsSlide } from "./ComponentsSlide";
import styles from "./slidesPanel.module.css";
import { changeSlidePosition, selectSlide} from "../../utils/function/functionSlide";
import { useState } from "react";
import { dispatch } from "../../editor";

type SlidesPanelProps = {
  presentation: Presentation;
  onSlideClick: (slide: Slide, index: number) => void;
};

function SlidesPanel(props: SlidesPanelProps) {
  const scale = 0.2;
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, slideId: string) => {
    e.dataTransfer.setData("text/plain", slideId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const draggedSlideId = e.dataTransfer.getData("text/plain");
    
    if (draggedSlideId) {
      dispatch(selectSlide, draggedSlideId);
      dispatch(changeSlidePosition, {slideId: draggedSlideId, newIndex: targetIndex});
    }
    
    setDragOverIndex(null);
  };

  return (
    <div className={styles.slidesPanel}>
      <div className={styles.slidesPanelHeader}>
        <h3>Слайды</h3>
        <Toolbar presentation={props.presentation} mode="slidesPanel" />
      </div>
      <div className={styles.slidesList}>
        {props.presentation.allSlides.map((slide, index) => {
          const isActive = slide.id === props.presentation.selected.currentSlideId;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={slide.id}
              className={`${styles.slideThumbnail} ${isActive ? styles.active : ""} ${
                isDragOver ? styles.dragOver : ""
              }`}
              onClick={() => props.onSlideClick(slide, index)}
              draggable
              onDragStart={(e) => handleDragStart(e, slide.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <div
                  className={styles.thumbnailSlide}
                  style={renderSlideBackground(slide.background)}
                >
                  {slide.elements.map((element) => (
                    <ComponentsSlide
                      key={element.id}
                      presentation={props.presentation}
                      element={element}
                      onClick={() => { }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { SlidesPanel };