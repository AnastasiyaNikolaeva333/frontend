import { Toolbar } from "../../Button/Toolbar";
import { renderSlideBackground } from "../BackroundSlide";
import styles from "./slidesPanel.module.css";
import { useAppSelector, useAppDispatch } from '../../../utils/hooks/redux';
import { selectSlide, changeSlidePosition } from '../../../store/action-creators/slides';
import { useState, useEffect } from "react";
import { TextElementObject } from "../СomponentsSlide/TextElementObject";
import { ImageElementObject } from "../СomponentsSlide/ImageElementObject";

function SlidesPanel() {
  const dispatch = useAppDispatch();
  const slides = useAppSelector((state) => state.slides);
  const selected = useAppSelector((state) => state.selected);
  
  const scale = 0.2;
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (slides.length > 0 && !selected.currentSlideId) {
      dispatch(selectSlide(slides[0].id));
    }
  }, [slides, selected.currentSlideId, dispatch]);

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
      dispatch(selectSlide(draggedSlideId));
      dispatch(changeSlidePosition(draggedSlideId, targetIndex));
    }

    setDragOverIndex(null);
  };

  const handleSlideClick = (slideId: string) => {
    dispatch(selectSlide(slideId));
  };

  return (
    <div className={styles.slidesPanel}>
      <div className={styles.slidesPanelHeader}>
        <h3>Слайды</h3>
        <Toolbar mode="slidesPanel" />
      </div>
      <div className={styles.slidesList}>
        {slides.map((slide, index) => {
          const isActive = slide.id === selected.currentSlideId;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={slide.id}
              className={`${styles.slideThumbnail} ${isActive ? styles.active : ""} ${isDragOver ? styles.dragOver : ""}`}
              onClick={() => handleSlideClick(slide.id)}
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
                  {slide.elements.map((element) => 
                    element.type === "text" ? (
                      <TextElementObject
                        key={element.id}
                        element={element}
                        onClick={() => {}}
                      />
                    ) : (
                      <ImageElementObject
                        key={element.id}
                        element={element}
                        onClick={() => {}} 
                      />
                    )
                  )}
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