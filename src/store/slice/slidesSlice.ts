import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Slide, SlideElement, Position, Size, Background, ID, TextElement, ImageElement } from '../../types/presentationTypes';

type SlidesState = {
  slides: Slide[];
}

const initialState: SlidesState = {
  slides: [],
};


const slidesSlice = createSlice({
  name: 'slides',
  initialState,
  reducers: {
    addSlide: (state, action: PayloadAction<{ slide: Slide; currentIndex: ID[] }>) => {
      const { slide, currentIndex } = action.payload;
      const selectedSlideIndex = state.slides.findIndex(
        slideItem => slideItem.id === currentIndex[0]
      );

      if (selectedSlideIndex === -1) {
        state.slides.push(slide);
      } else {
        state.slides.splice(selectedSlideIndex + 1, 0, slide);
      }
    },

    removeSlides: (state, action: PayloadAction<string[]>) => {
      state.slides = state.slides.filter(item => !action.payload.includes(item.id));
    },

    updateSlideBackground: (state, action: PayloadAction<{ slideId: string[]; background: Background }>) => {
      const { slideId, background } = action.payload;
      const slide = state.slides.find(s => slideId[0].includes(s.id));
      if (slide) {
        slide.background = background;
      }
    },

    changeSlidePositions: (state, action: PayloadAction<{ slideIds: string[]; targetIndex: number }>) => {
      const { slideIds, targetIndex } = action.payload;

      if (slideIds.length === 0 || targetIndex < 0) {
        return;
      }

      // 1. Получаем слайды для перемещения
      const slidesToMove = state.slides.filter(slide => slideIds.includes(slide.id));

      // 2. Фильтруем оставшиеся слайды (убираем те, которые перемещаем)
      const remainingSlides = state.slides.filter(slide => !slideIds.includes(slide.id));

      // 3. Корректируем targetIndex для оставшихся слайдов
      const adjustedTargetIndex = Math.min(targetIndex, remainingSlides.length);

      // 4. Создаем новый массив с правильным порядком
      const newSlides = [
        ...remainingSlides.slice(0, adjustedTargetIndex),
        ...slidesToMove,
        ...remainingSlides.slice(adjustedTargetIndex)
      ];

      // 5. Заменяем слайды
      state.slides = newSlides;
    },

    addElement: (state, action: PayloadAction<{ slideId: string[]; element: Omit<SlideElement, 'id'> }>) => {
      const { slideId, element } = action.payload;
      const slide = state.slides.find(s => slideId[0].includes(s.id));

      if (slide) {
        const elementWithId = {
          ...element,
        };

        if (element.type === 'text') {
          slide.elements.push(elementWithId as TextElement);
        } else {
          slide.elements.push(elementWithId as ImageElement);
        }
      }
    },

    removeElements: (state, action: PayloadAction<{ slideId: string[]; elementIds: string[] }>) => {
      const { slideId, elementIds } = action.payload;
      const slide = state.slides.find(s => slideId[0].includes(s.id));

      if (slide) {
        slide.elements = slide.elements.filter(
          element => !elementIds.includes(element.id)
        );
      }
    },

    updateElementPosition: (state, action: PayloadAction<{ slideId: string[]; elementId: string; newPosition: Position }>) => {
      const { slideId, elementId, newPosition } = action.payload;
      const slide = state.slides.find(s => s.id === slideId[0]);

      if (slide) {
        const element = slide.elements.find(el => el.id === elementId);
        if (element) {
          element.position = newPosition;

          const elementIndex = slide.elements.indexOf(element);
          if (elementIndex !== slide.elements.length - 1) {
            slide.elements.splice(elementIndex, 1);
            slide.elements.push(element);
          }
        }
      }
    },

    updateMultipleElementPositions: (state, action: PayloadAction<Array<{
      slideId: string[];
      elementId: string;
      newPosition: Position;
    }>>) => {
      const updates = action.payload;

      const updatesBySlide: { [slideId: string]: Array<{ elementId: string; newPosition: Position }> } = {};

      updates.forEach(update => {
        if (!updatesBySlide[update.slideId[0]]) {
          updatesBySlide[update.slideId[0]] = [];
        }
        updatesBySlide[update.slideId[0]].push({
          elementId: update.elementId,
          newPosition: update.newPosition
        });
      });

      Object.entries(updatesBySlide).forEach(([slideId, slideUpdates]) => {
        const slide = state.slides.find(s => s.id === slideId);
        if (slide) {
          slideUpdates.forEach(({ elementId, newPosition }) => {
            const element = slide.elements.find(el => el.id === elementId);
            if (element) {
              element.position = newPosition;
            }
          });
        }
      });
    },

    updateElementSize: (state, action: PayloadAction<{ slideId: string[]; elementId: string; newSize: Size }>) => {
      const { slideId, elementId, newSize } = action.payload;
      console.log(" resize ", action.payload)
      const slide = state.slides.find(s => slideId[0].includes(s.id));

      if (slide) {
        const element = slide.elements.find(el => el.id === elementId);
        if (element) {
          element.sizes = newSize;
        }
      }
    },

    updateTextContent: (state, action: PayloadAction<{ slideId: string[]; elementId: string; newText: string }>) => {
      const { slideId, elementId, newText } = action.payload;
      const slide = state.slides.find(s => slideId[0].includes(s.id));

      if (slide) {
        const element = slide.elements.find(el =>
          el.id === elementId && el.type === 'text'
        ) as TextElement | undefined;
        if (element) {
          element.content = newText;
        }
      }
    },

    restoreState: (state, action: PayloadAction<{ slides: Slide[] }>) => {
      state.slides = action.payload.slides.map(slide => ({
        ...slide,
        elements: [...slide.elements]
      }));
    },
  },
});

export const {
  addSlide,
  removeSlides,
  updateSlideBackground,
  changeSlidePositions,
  addElement,
  removeElements,
  updateElementPosition,
  updateElementSize,
  updateTextContent,
  updateMultipleElementPositions,
  restoreState,
} = slidesSlice.actions;

export default slidesSlice.reducer;