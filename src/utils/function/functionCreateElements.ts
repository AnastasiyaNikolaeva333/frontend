import type { TextElement, ImageElement, Color, Slide } from "../../types/presentationTypes";
import { standardColorBackround } from "../tests/DataTestPresentation.ts";
import { uploadImageToStorage } from "../../appwrite/storageService";
import { getSessionUserId } from "../../appwrite/session";

export const createTextElement = (): TextElement => ({
  id: `text-${Date.now()}`,
  type: "text",
  content: "",
  position: { x: 0, y: 0 },
  sizes: { width: 200, height: 40 },
  style: {
    color: {
      type: "color",
      color: "#000000",
    } as Color,
    fontStyle: "normal",
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "normal",
  },
});

export const createImageElement = (
  userId?: string, 
  maxWidth: number = 960, 
  maxHeight: number = 477
): Promise<ImageElement> => {
  return new Promise((resolve, reject) => {
    const uid = userId ?? getSessionUserId();
    if (!uid) {
      reject(new Error("Нет userId. Сначала авторизуйся."));
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.onchange = async (e) => {
      try {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        const { width: originalWidth, height: originalHeight } = await new Promise<{ width: number; height: number }>(
          (res, rej) => {
            const img = new Image();
            img.onload = () => res({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => rej(new Error("Не удалось прочитать изображение"));
            img.src = localUrl;
          },
        );
        URL.revokeObjectURL(localUrl);

        const uploaded = await uploadImageToStorage(file, uid);
        
        let finalWidth = originalWidth;
        let finalHeight = originalHeight;
        
        if (originalWidth > maxWidth || originalHeight > maxHeight) {
          const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
          finalWidth = Math.round(originalWidth * scale);
          finalHeight = Math.round(originalHeight * scale);
        }
        
        finalWidth = Math.min(finalWidth, maxWidth);
        finalHeight = Math.min(finalHeight, maxHeight);

        const imageElement: ImageElement = {
          id: `image-${Date.now()}`,
          type: "image",
          src: uploaded.url,
          position: { x: 0, y: 0 },
          sizes: {
            width: finalWidth,
            height: finalHeight,
          },
        };

        resolve(imageElement);
      } catch (err) {
        reject(err);
      } finally {
        if (document.body.contains(fileInput)) document.body.removeChild(fileInput);
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
  });
};

export const createNewSlide = (): Slide => ({
  id: `slide-${Date.now()}`,
  elements: [],
  background: standardColorBackround,
});
