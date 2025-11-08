import type { Presentation, SlideElement } from "../../types/presentationTypes";
import { ComponentsSlide } from "./ComponentsSlide";
import { renderSlideBackground } from "./BackroundSlide";
import styles from "./currentSlide.module.css";

type CurrentSlideProps = {
  presentation: Presentation;
  onElementClick: (element: SlideElement) => void;
};

function CurrentSlide(props: CurrentSlideProps) {
  const currentSlide =
    props.presentation.allSlides.find(
      (slide) => slide.id === props.presentation.selected.currentSlideId,
    ) || props.presentation.allSlides[0];

  return (
    <div className={styles.currentSlide} style={renderSlideBackground(currentSlide.background)}>
      {currentSlide.elements.map((element) => (
        <ComponentsSlide key={element.id} presentation={props.presentation} element={element} onClick={props.onElementClick} />
      ))}
    </div>
  );
}

export {
  CurrentSlide,
}