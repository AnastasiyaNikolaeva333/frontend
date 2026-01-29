import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Slide,
  SlideElement,
  Position,
  Size,
  Background,
  ID,
  TextElement,
  ImageElement,
} from "../../types/presentationTypes";

type PresentationState = {
  title: string;
  slides: Slide[];
};

const initialState: PresentationState = {
  title: 'Новая презентация',
  slides: [],
};

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    changePresentationTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },

    restoreState: (state, action: PayloadAction<PresentationState>) => {
      state.title = action.payload.title;
      state.slides = action.payload.slides.map((slide) => ({
        ...slide,
        elements: [...slide.elements],
      }));
    },

    addSlide: (state, action: PayloadAction<{ slide: Slide; currentIndex: ID[] }>) => {
      const { slide, currentIndex } = action.payload;
      let maxSelectedIndex = -1;

      for (let i = 0; i < state.slides.length; i++) {
        if (currentIndex.includes(state.slides[i].id)) {
          maxSelectedIndex = i;
        }
      }

      if (maxSelectedIndex === -1) {
        state.slides.push(slide);
      } else {
        state.slides.splice(maxSelectedIndex + 1, 0, slide)
      }
    },

    addZerroSlide: (state, action: PayloadAction<{ slide: Slide}>) => {
      const { slide } = action.payload

      state.slides.push(slide);
    },

    removeSlides: (state, action: PayloadAction<string[]>) => {
      state.slides = state.slides.filter((item) => !action.payload.includes(item.id));
    },

    updateSlideBackground: (
      state,
      action: PayloadAction<{ slideId: string[]; background: Background }>,
    ) => {
      const { slideId, background } = action.payload;
      const slide = state.slides.find((s) => slideId[0] === s.id);
      if (slide) {
        slide.background = background;
      }
    },

    changeSlidePositions: (
      state,
      action: PayloadAction<{ slideIds: string[]; targetIndex: number }>,
    ) => {
      const { slideIds, targetIndex } = action.payload;

      if (slideIds.length === 0 || targetIndex < 0) {
        return;
      }

      const slidesToMove = state.slides.filter((slide) => slideIds.includes(slide.id));

      const remainingSlides = state.slides.filter((slide) => !slideIds.includes(slide.id));

      const adjustedTargetIndex = Math.min(targetIndex, remainingSlides.length);

      const newSlides = [
        ...remainingSlides.slice(0, adjustedTargetIndex),
        ...slidesToMove,
        ...remainingSlides.slice(adjustedTargetIndex),
      ];

      state.slides = newSlides;
    },

    addElement: (
      state,
      action: PayloadAction<{ slideId: string[]; element: Omit<SlideElement, "id"> }>,
    ) => {
      const { slideId, element } = action.payload;
      const slide = state.slides.find((s) => slideId[0].includes(s.id));

      if (slide) {
        const elementWithId = {
          ...element,
        };

        if (element.type === "text") {
          slide.elements.push(elementWithId as TextElement);
        } else {
          slide.elements.push(elementWithId as ImageElement);
        }
      }
    },

    removeElements: (state, action: PayloadAction<{ slideId: string[]; elementIds: string[] }>) => {
      const { slideId, elementIds } = action.payload;
      const slide = state.slides.find((s) => slideId[0] === s.id);

      if (slide) {
        slide.elements = slide.elements.filter((element) => !elementIds.includes(element.id));
      }
    },

    updateElementPositions: (
      state,
      action: PayloadAction<Array<{
        slideId: string[];
        elementId: string;
        newPosition: Position;
      }>>,
    ) => {
      const updates = action.payload;

      if (updates.length === 0) return;

      const firstSlideId = updates[0].slideId[0];
      const slide = state.slides.find(s => s.id === firstSlideId);

      if (!slide) return;

      updates.forEach(({ elementId, newPosition }) => {
        const element = slide.elements.find(el => el.id === elementId);
        if (element) {
          element.position = newPosition;
        }
      });

      const updatedElementIds = updates.map(update => update.elementId);
      const elementsToMove = slide.elements.filter(el =>
        updatedElementIds.includes(el.id)
      );

      if (elementsToMove.length > 0) {
        slide.elements = slide.elements.filter(el =>
          !updatedElementIds.includes(el.id)
        );

        slide.elements.push(...elementsToMove);
      }
    },

    updateElementSize: (
      state,
      action: PayloadAction<{ slideId: string[]; elementId: string; newSize: Size }>,
    ) => {
      const { slideId, elementId, newSize } = action.payload;
      const slide = state.slides.find((s) => slideId[0] === (s.id));

      if (slide) {
        const element = slide.elements.find((el) => el.id === elementId);
        if (element) {
          element.sizes = newSize;
        }
      }
    },

    updateTextContent: (
      state,
      action: PayloadAction<{ slideId: string[]; elementId: string; newText: string }>,
    ) => {
      const { slideId, elementId, newText } = action.payload;
      const slide = state.slides.find((s) => slideId[0].includes(s.id));

      if (slide) {
        const element = slide.elements.find((el) => el.id === elementId && el.type === "text") as
          | TextElement
          | undefined;
        if (element) {
          element.content = newText;
        }
      }
    },
  },
});

export const {
  changePresentationTitle,
  restoreState,
  addSlide,
  addZerroSlide,
  removeSlides,
  updateSlideBackground,
  changeSlidePositions,
  addElement,
  removeElements,
  updateElementSize,
  updateTextContent,
  updateElementPositions,
} = presentationSlice.actions;

export default presentationSlice.reducer;