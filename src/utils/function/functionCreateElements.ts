import type { TextElement, ImageElement, Color, Slide } from '../../types/presentationTypes';
import { standardColorBackround } from "../tests/DataTestPresentation.ts";

export const createTextElement = (): TextElement => ({
    id: `text-${Date.now()}`,
    type: "text",
    content: "",
    position: { x: 100, y: 100 },
    sizes: { width: 200, height: 40 },
    style: {
        color: { 
            type: "color",
            color: "#000000" 
        } as Color,
        fontStyle: "normal",
        fontFamily: "Arial",
        fontSize: 16,
        fontWeight: "700",
    }
});

export const createImageElement = (): Promise<ImageElement & { id: string }> => {
    return new Promise((resolve) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                const reader = new FileReader();

                reader.onload = (event) => {
                    const src = event.target?.result as string;

                    const img = new Image();
                    img.onload = () => {
                        const imageElement: Omit<ImageElement, 'id'> & { id: string } = {
                            id: `image-${Date.now()}`,
                            type: "image",
                            src: src,
                            position: { x: 50, y: 50 },
                            sizes: {
                                width: Math.min(img.width, 960),
                                height: Math.min(img.height, 510)
                            },
                        };
                        resolve(imageElement);
                        document.body.removeChild(fileInput);
                    };
                    img.src = src;
                };

                reader.readAsDataURL(file);
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