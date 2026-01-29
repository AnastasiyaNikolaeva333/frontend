import { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../utils/hooks/redux";

import { Toolbar } from "../../Button/Toolbar";
import { renderSlideBackground } from "../BackroundSlide";
import styles from "./slidesPanel.module.css";
import type { Slide, SlideElement } from "../../../types/presentationTypes";
import { SimplifiedImageElement, SimplifiedTextElement } from "./SlideThumbnailContent";
import { changeSlidePositions, selectCurrentSlideId, selectSelectedElementIds, selectSlide, selectSlides } from "../../../store";

const scale = 0.2;

const SlidesPanel = () => {
  const dispatch = useAppDispatch();
  const slides = useAppSelector(selectSlides);
  const currentSlideId = useAppSelector(selectCurrentSlideId);
  const selectedElementIds = useAppSelector(selectSelectedElementIds); 
  
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const slidesListRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const currentSlideIdStr = currentSlideId.length > 0 ? currentSlideId[0] : null;

  const isCurrentSlide = (slideId: string) => {
    return currentSlideIdStr === slideId;
  };

  const isElementSelectedOnCurrentSlide = (elementId: string, slideId: string) => {
    return isCurrentSlide(slideId) && selectedElementIds.includes(elementId);
  };

  useEffect(() => {
    if (slides.length > 0 && currentSlideId.length === 0) {
      const firstSlideId = slides[0].id;
      dispatch(selectSlide([firstSlideId]));
      setLastSelectedIndex(0);
    }
  }, [slides, currentSlideId, dispatch]);

  useEffect(() => {
    if (currentSlideId.length > 0) {
      const firstId = currentSlideId[0];
      const index = slides.findIndex((slide) => slide.id === firstId);
      if (index !== -1) setLastSelectedIndex(index);
    }
  }, [currentSlideId, slides]);

  useEffect(() => {
    if (currentSlideId.length > 0 && shouldAutoScrollRef.current) {
      const firstId = currentSlideId[0];
      const slideElement = document.getElementById(`slide-thumb-${firstId}`);
      if (slideElement) {
        setTimeout(() => {
          slideElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }, 100);
      }
    }
  }, [currentSlideId]);

  const handleSlideClick = useCallback((e: React.MouseEvent, slideId: string, index: number) => {
    e.stopPropagation();

    let newSelectedIds: string[] = [];

    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      newSelectedIds = slides.slice(start, end + 1).map((s) => s.id);
    } 

    else if (e.ctrlKey || e.metaKey) {
      const isSelected = currentSlideId.includes(slideId);
      newSelectedIds = isSelected
        ? currentSlideId.filter((id) => id !== slideId)
        : [...currentSlideId, slideId];
    } 

    else {
      newSelectedIds = [slideId];
    }

    dispatch(selectSlide(newSelectedIds));
    setLastSelectedIndex(index);
  }, [slides, currentSlideId, lastSelectedIndex, dispatch]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const targetId = e.currentTarget.dataset.slideId!;
    const isTargetSelected = currentSlideId.includes(targetId);

    const slideIdsToDrag = isTargetSelected ? currentSlideId : [targetId];

    if (!isTargetSelected) {
      dispatch(selectSlide([targetId]));
    }

    e.dataTransfer.setData("text/plain", JSON.stringify(slideIdsToDrag));
    e.dataTransfer.effectAllowed = "move";
  }, [currentSlideId, dispatch]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();

    try {
      const raw = e.dataTransfer.getData("text/plain");
      const slideIdsToMove = JSON.parse(raw) as string[];

      if (slideIdsToMove.length === 0) return;

      dispatch(changeSlidePositions({ slideIds: slideIdsToMove, targetIndex }));
      dispatch(selectSlide(slideIdsToMove));
    } catch (error) {
      console.error("Ошибка при перемещении слайдов:", error);
    }
  }, [dispatch]);

  const handleBackgroundClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;

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

      <div className={styles.slidesList} onClick={handleBackgroundClick} ref={slidesListRef}>
        {slides.map((slide: Slide, index: number) => {
          const isSelected = currentSlideId.includes(slide.id);

          return (
            <div
              key={slide.id}
              id={`slide-thumb-${slide.id}`}
              data-slide-id={slide.id}
              className={`${styles.slideThumbnail} ${isSelected ? styles.active : ""}`} 
              draggable
              onClick={(e) => handleSlideClick(e, slide.id, index)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div
                className={styles.thumbScale}
                style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
              >
                <div
                  className={styles.thumbnailSlide}
                  style={renderSlideBackground(slide.background)}
                >
                  {slide.elements?.map((element: SlideElement) =>
                    element.type === "text" ? (
                      <SimplifiedTextElement 
                        key={element.id} 
                        element={element} 
                        scale={scale} 
                        isSelected={isElementSelectedOnCurrentSlide(element.id, slide.id)}
                      />
                    ) : (
                      <SimplifiedImageElement 
                        key={element.id} 
                        element={element} 
                        scale={scale} 
                        isSelected={isElementSelectedOnCurrentSlide(element.id, slide.id)}
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
};

export { SlidesPanel };