import { Toolbar } from "../../Button/Toolbar";
import { renderSlideBackground } from "../BackroundSlide";
import styles from "./slidesPanel.module.css";
import { useAppSelector, useAppDispatch } from '../../../utils/hooks/redux';
import { changeSlidePositions } from '../../../store';
import { selectSlide, selectSlides, selectCurrentSlideId } from "../../../store";
import { useState, useEffect, useCallback, useRef } from "react";
import { TextElementObject } from "../СomponentsSlide/TextElement/TextElementObject";
import { ImageElementObject } from "../СomponentsSlide/ImageElement/ImageElementObject"; 
import type { Slide, SlideElement } from '../../../types/presentationTypes';

function SlidesPanel() {
  const dispatch = useAppDispatch();
  const slides = useAppSelector(selectSlides);
  const currentSlideId = useAppSelector(selectCurrentSlideId); // содержит ВСЕ выделенные слайды

  const scale = 0.2;
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const slidesListRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  // Установка первого слайда по умолчанию
  useEffect(() => {
    if (slides.length > 0 && currentSlideId.length === 0) {
      const firstSlideId = slides[0].id;
      dispatch(selectSlide([firstSlideId]));
      setLastSelectedIndex(0);
    }
  }, [slides, currentSlideId, dispatch]);

  // Синхронизация lastSelectedIndex
  useEffect(() => {
    if (currentSlideId.length > 0) {
      const firstId = currentSlideId[0];
      const index = slides.findIndex(slide => slide.id === firstId);
      if (index !== -1) {
        setLastSelectedIndex(index);
      }
    }
  }, [currentSlideId, slides]);

  // Автопрокрутка к первому выделенному слайду
  useEffect(() => {
    if (currentSlideId.length > 0 && shouldAutoScrollRef.current) {
      const firstId = currentSlideId[0];
      const slideElement = document.getElementById(`slide-thumb-${firstId}`);
      if (slideElement) {
        setTimeout(() => {
          slideElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
          });
        }, 100);
      }
    }
  }, [currentSlideId]);

  const handleSlideClick = (e: React.MouseEvent, slideId: string, index: number) => {
    e.stopPropagation();
    shouldAutoScrollRef.current = true;

    let newSelectedIds: string[] = [];

    if (e.shiftKey && lastSelectedIndex !== null) {
      // Выделение диапазона
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      newSelectedIds = slides.slice(start, end + 1).map(slide => slide.id);
    } 
    else if (e.ctrlKey || e.metaKey) {
      // Множественный выбор - добавляем/удаляем из текущего выделения
      const isSelected = currentSlideId.includes(slideId);
      newSelectedIds = isSelected
        ? currentSlideId.filter(id => id !== slideId)
        : [...currentSlideId, slideId];
    } 
    else {
      // Одиночный выбор
      newSelectedIds = [slideId];
    }

    // Обновляем выделение (всегда передаем массив)
    dispatch(selectSlide(newSelectedIds));
    setLastSelectedIndex(index);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, slideId: string) => {
    // Используем currentSlideId (все выделенные слайды)
    const slideIdsToDrag = currentSlideId.length > 0 ? currentSlideId : [slideId];
    e.dataTransfer.setData("text/plain", JSON.stringify(slideIdsToDrag));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();

    try {
      const slideIdsToMove = JSON.parse(e.dataTransfer.getData("text/plain")) as string[];

      if (slideIdsToMove.length === 0) return;

      dispatch(changeSlidePositions({
        slideIds: slideIdsToMove,
        targetIndex: targetIndex
      }));

      // После перемещения выделяем те же слайды
      dispatch(selectSlide(slideIdsToMove));
      
      // Обновляем индекс первого выделенного слайда
      if (slideIdsToMove.length > 0) {
        const index = slides.findIndex(slide => slide.id === slideIdsToMove[0]);
        if (index !== -1) {
          setLastSelectedIndex(index);
        }
      }
    } catch (error) {
      console.error("Ошибка при перемещении слайдов:", error);
    }
  };

  const handleBackgroundClick = useCallback(() => {
    // При клике на фон сбрасываем выделение (выделяем первый слайд)
    if (slides.length > 0) {
      const firstSlideId = slides[0].id;
      dispatch(selectSlide([firstSlideId]));
      setLastSelectedIndex(0);
    }
  }, [slides, dispatch]);

  return (
    <div className={styles.slidesPanel}>
      <div className={styles.slidesPanelHeader}>
        <h3>Слайды</h3>
        <div className={styles.headerControls}>
          <Toolbar mode="slidesPanel" />
        </div>
      </div>
      <div
        className={styles.slidesList}
        onClick={handleBackgroundClick}
        ref={slidesListRef}
      >
        {slides.map((slide: Slide, index: number) => {
          const isSelected = currentSlideId.includes(slide.id);

          return (
            <div
              key={slide.id}
              id={`slide-thumb-${slide.id}`}
              data-slide-id={slide.id}
              className={`
                ${styles.slideThumbnail} 
                ${isSelected ? styles.active : ""} 
              `}
              onClick={(e) => handleSlideClick(e, slide.id, index)}
              draggable
              onDragStart={(e) => handleDragStart(e, slide.id)}
              onDragOver={handleDragOver}
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
                  {slide.elements?.map((element: SlideElement) =>
                    element.type === "text" ? (
                      <TextElementObject
                        key={element.id}
                        element={element}
                        onClick={() => { }}
                      />
                    ) : (
                      <ImageElementObject
                        key={element.id}
                        element={element}
                        onClick={() => { }}
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