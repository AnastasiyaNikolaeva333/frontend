import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../utils/hooks/redux";
import { selectSlides, selectPresentationTitle, selectCurrentSlideId } from "../../store";
import { renderSlideBackground } from "../Slide/BackroundSlide";
import { SimplifiedImageElement, SimplifiedTextElement } from "../Slide/SlidesPanel/SlideThumbnailContent";
import type { Slide, SlideElement } from "../../types/presentationTypes";
import styles from "./playerPage.module.css";
import style from "../Presentation/HeadPresentation.module.css";
import { MyButton } from "../Button/Buttons";
import { setHistory } from "../../store/history/undoRedoSlice";

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 477;

export default function PlayerPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const title = useAppSelector(selectPresentationTitle);
  const slides = useAppSelector(selectSlides);
  const currentSlideId = useAppSelector(selectCurrentSlideId);

  dispatch(setHistory({ past: [], future: [] }));

  const initialIndex = useMemo(() => {
    const id = currentSlideId?.[0];
    if (!id) return 0;
    const idx = slides.findIndex((s) => s.id === id);
    return idx >= 0 ? idx : 0;
  }, [slides, currentSlideId]);

  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  const slide: Slide | null = slides[index] ?? null;

  const calculateScale = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const stageWidth = rect.width;
    const stageHeight = rect.height;

    if (stageWidth <= 0 || stageHeight <= 0) return;

    const aspectRatio = SLIDE_WIDTH / SLIDE_HEIGHT;
    const stageAspect = stageWidth / stageHeight;

    let newScale;
    
    if (stageAspect > aspectRatio) {
      newScale = (stageHeight * 0.9) / SLIDE_HEIGHT;
    } else {
      newScale = (stageWidth * 0.9) / SLIDE_WIDTH;
    }

    setScale(Math.max(0.5, Math.min(newScale, 2)));
  }, []);

  useEffect(() => {
    calculateScale();
    
    const handleResize = () => requestAnimationFrame(calculateScale);
    window.addEventListener("resize", handleResize);
    
    const resizeObserver = new ResizeObserver(handleResize);
    const stage = stageRef.current;
    if (stage) resizeObserver.observe(stage);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (stage) resizeObserver.unobserve(stage);
    };
  }, [calculateScale]);

  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(slides.length - 1, i + 1));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {

      switch(e.key) {
        case 'Escape':
          navigate("/editor");
          break;
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prev();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, slides.length]);

  if (!slides.length) {
    return (
      <div className={styles.page} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#666', marginBottom: '20px' }}>Нет слайдов</h2>
        <MyButton onClick={() => navigate("/editor")} variant="primary">
          Создать слайд
        </MyButton>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.headerContentPlaer}>
          <img className={style.logoIcon} src="src/assets/logotip.png" alt="Логотип" />
          <span className={style.presentationTitle}>{title}</span>
          <span className={styles.counter}>
            {index + 1} / {slides.length}
          </span>
        </div>

        <div className={styles.actions}>
          <MyButton
            onClick={() => navigate("/editor")}
            variant="secondary"
            className={styles.btn}
          >
            ← В редактор
          </MyButton>
          <MyButton
            onClick={prev}
            disabled={index === 0}
            variant="primary"
          >
            Назад
          </MyButton>
          <MyButton
            onClick={next}
            disabled={index === slides.length - 1}
            variant="primary"
          >
            Вперёд
          </MyButton>
        </div>
      </div>

      <div className={styles.stage} ref={stageRef}>
        {slide && (
          <div
            className={styles.slideWrapper}
            style={{
              width: SLIDE_WIDTH,
              height: SLIDE_HEIGHT,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            <div 
              className={styles.slide} 
              style={renderSlideBackground(slide.background)}
            >
              <div className={styles.noEvents}>
                {slide.elements?.map((el: SlideElement) =>
                  el.type === "text" ? (
                    <SimplifiedTextElement key={el.id} element={el} scale={scale} />
                  ) : (
                    <SimplifiedImageElement key={el.id} element={el} scale={scale} />
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}