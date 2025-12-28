import type {
  Presentation,
  Slide,
  Color,
  TextElement,
  ImageElement,
  Picture,
  Gradient,
} from "../../types/presentationTypes";
import { createSelected } from "../function/functionPresentation";

const standardColorBackround: Color = {
  type: "color",
  color: "#FFFFFFFF",
};

const colorBackground: Color = {
  type: "color",
  color: "#63e75fff",
};

const pictureBackground: Picture = {
  type: "picture",
  src: "src/assets/blueWhiteFon.png",
};

const gradientBackground: Gradient = {
  type: "gradient",
  colors: [
    { type: "color", color: "#4b92eeff" },
    { type: "color", color: "#9fe84bff" },
  ],
};

const maximalDataTextElement1: TextElement = {
  id: "maximal-text-1",
  type: "text",
  content: "Весна - прекрасное время года!",
  style: {
    fontFamily: "Times New Roman",
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
    color: { type: "color", color: "#275204ff" },
  },
  position: { x: 500, y: 100 },
  sizes: { width: 380, height: 50 },
};

const maximalDataTextElement2: TextElement = {
  id: "maximal-text-2",
  type: "text",
  content: "Зима пришла. Выпал снег. Совсем скоро Новый год. Буду наряжать ёлку с семьёйю",
  style: {
    fontFamily: "Arial, sans-serif",
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    color: { type: "color", color: "#600bf4ff" },
  },
  position: { x: 50, y: 300 },
  sizes: { width: 300, height: 100 },
};

const maximalDataImageElement1: ImageElement = {
  id: "maximal-image-1",
  type: "image",
  src: "src/assets/window.png",
  position: { x: 500, y: 50 },
  sizes: { width: 400, height: 300 },
};

const maximalDataImageElement2: ImageElement = {
  id: "maximal-image-2",
  type: "image",
  src: "src/assets/spring.png",
  position: { x: 40, y: 50 },
  sizes: { width: 400, height: 400 },
};

const maximalDataSlide1: Slide = {
  id: "maximal-slide-1",
  elements: [maximalDataTextElement1, maximalDataImageElement2],
  background: colorBackground,
};

const maximalDataSlide2: Slide = {
  id: "maximal-slide-2",
  elements: [maximalDataTextElement2, maximalDataImageElement1],
  background: pictureBackground,
};

const maximalDataSlide3: Slide = {
  id: "maximal-slide-3",
  elements: [
    maximalDataImageElement1,
    maximalDataImageElement2,
  ],
  background: gradientBackground,
};

const maximalDataSlide4: Slide = {
  id: "maximal-slide-4",
  elements: [
    maximalDataTextElement1, maximalDataImageElement2

  ],
  background: colorBackground,
};

const maximalDataSlide5: Slide = {
  id: "maximal-slide-5",
  elements: [
    maximalDataTextElement2, maximalDataImageElement1
  ],
  background: pictureBackground,
};

const maximalDataSlide6: Slide = {
  id: "maximal-slide-6",
  elements: [
    maximalDataImageElement1,
    maximalDataImageElement2,
  ],
  background: standardColorBackround,
};

const maximalPresentation: Presentation = {
  title: "Презентация с полным наполнением",
  allSlides: [
    maximalDataSlide1,
    maximalDataSlide2,
    maximalDataSlide3,
    maximalDataSlide4,
    maximalDataSlide5,
    maximalDataSlide6,
  ],
  selected: createSelected(),
};

export {
  maximalPresentation,
  standardColorBackround,
  pictureBackground
};
