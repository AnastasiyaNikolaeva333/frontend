type ID = string;

type Presentation = {
  title: string;
  allSlides: ColectionSlide;
  selected: Selected;
};

type ColectionSlide = Slide[];

type Slide = {
  id: ID;
  elements: SlideElement[];
  background: Background;
};

type SlideElement = TextElement | ImageElement;

type DefaultObj = {
  id: ID;
  position: Position;
  sizes: Size;
};

type TextElement = DefaultObj & {
  type: "text";
  content: string;
  style: FontStyle;
};

type Position = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type FontStyle = {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  color: Color;
};

type ImageElement = DefaultObj & {
  type: "image";
  src: string;
};

type Background = Color | Picture | Gradient;

type Color = {
  type: "color";
  color: string;
};

type Picture = {
  type: "picture";
  src: string;
};

type Gradient = {
  type: "gradient";
  colors: Color[];
};

type Selected = {
  currentSlideId: ID[];
  selectedElementIds: Set<ID>;
};

export type {
  ID,
  Presentation,
  Slide,
  SlideElement,
  Position,
  Size,
  Selected,
  Color,
  Background,
  TextElement,
  ImageElement,
  Picture,
  Gradient,
};
