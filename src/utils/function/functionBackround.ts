import type { Color, Background } from "../../types/presentationTypes";
import { useAppDispatch, useAppSelector } from '../../utils/hooks/redux';
import { updateSlideBackground } from '../../store/action-creators/slides';
import { createImageElement } from './functionCreateElements'; 

function showColorPicker(dispatch: any, slideId: string | null) {
    if (!slideId) return;
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#ffffff';
    colorInput.style.cssText = `opacity: 0;`;

    colorInput.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.value) {
            const background: Background = { 
                type: "color", 
                color: target.value 
            };
            dispatch(updateSlideBackground(slideId, background));
        }
        document.body.removeChild(colorInput);
    };

    colorInput.onblur = () => {
        document.body.removeChild(colorInput);
    };

    document.body.appendChild(colorInput);
    colorInput.click();
}

function showGradientPicker(dispatch: any, slideId: string | null) {
    if (!slideId) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 300px;
    `;

    const colors: string[] = ['#ffffff', '#ffffff'];
    let colorElements: HTMLElement[] = [];

    const updatePreview = () => {
        const gradientValue = colors.length > 1
            ? `linear-gradient(90deg, ${colors.join(', ')})`
            : colors[0];
        preview.style.background = gradientValue;
    };

    const renderColorList = () => {
        colorList.innerHTML = '';
        colorElements = [];

        colors.forEach((color, index) => {
            const colorItem = document.createElement('div');
            colorItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
            `;

            const colorPreview = document.createElement('div');
            colorPreview.style.cssText = `
                width: 30px;
                height: 30px;
                background: ${color};
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
            `;

            const colorText = document.createElement('span');
            colorText.textContent = color;
            colorText.style.flex = '1';

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.style.cssText = `
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                cursor: pointer;
            `;

            colorPreview.onclick = () => {
                showSingleColorPicker(color).then(newColor => {
                    if (newColor) {
                        colors[index] = newColor;
                        colorPreview.style.background = newColor;
                        colorText.textContent = newColor;
                        updatePreview();
                    }
                });
            };

            removeBtn.onclick = () => {
                if (colors.length > 2) {
                    colors.splice(index, 1);
                    renderColorList();
                    updatePreview();
                } else {
                    alert('Градиент должен содержать минимум 2 цвета');
                }
            };

            colorItem.appendChild(colorPreview);
            colorItem.appendChild(colorText);
            colorItem.appendChild(removeBtn);
            colorList.appendChild(colorItem);
            colorElements.push(colorItem);
        });
    };

    content.innerHTML = `
        <h3 style="margin: 0 0 10px 0; text-align: center;">Настройка градиента</h3>
        <div style="margin-bottom: 10px;">
            <div id="gradient-preview" style="height: 50px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;"></div>
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <button id="add-color">+ Добавить цвет</button>
            </div>
        </div>
        <div id="color-list" style="max-height: 200px; overflow-y: auto; margin-bottom: 10px;"></div>
        <div style="display: flex; gap: 10px;">
            <button id="apply-gradient" style="flex: 1; background: #4CAF50; color: white;">Применить</button>
            <button id="cancel-gradient" style="flex: 1; background: #f44336; color: white;">Отмена</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    const preview = document.getElementById('gradient-preview')!;
    const colorList = document.getElementById('color-list')!;
    const addColorBtn = document.getElementById('add-color')!;
    const applyBtn = document.getElementById('apply-gradient')!;
    const cancelBtn = document.getElementById('cancel-gradient')!;

    renderColorList();
    updatePreview();

    addColorBtn.onclick = () => {
        const newColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        colors.push(newColor);
        renderColorList();
        updatePreview();
    };

    applyBtn.onclick = () => {
        if (colors.length < 2) {
            alert('Градиент должен содержать минимум 2 цвета');
            return;
        }

        const gradientColors: Color[] = colors.map(color => ({
            type: "color",
            color: color
        }));

        const background: Background = {
            type: "gradient",
            colors: gradientColors
        };
        
        dispatch(updateSlideBackground(slideId, background));
        document.body.removeChild(modal);
    };

    cancelBtn.onclick = () => {
        document.body.removeChild(modal);
    };
}

function showSingleColorPicker(currentColor: string = '#ffffff'): Promise<string | null> {
    return new Promise((resolve) => {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = currentColor;
        colorInput.style.cssText = `opacity: 0;`;

        colorInput.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            resolve(target.value);
            document.body.removeChild(colorInput);
        };

        colorInput.onblur = () => {
            resolve(null);
            document.body.removeChild(colorInput);
        };

        document.body.appendChild(colorInput);
        colorInput.click();
    });
}

export function useBackgroundActions() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.selected);

  const handleChangeBackground = () => {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 200px;
    `;

    content.innerHTML = `
        <h3 style="margin: 0 0 10px 0;">Выберите тип фона</h3>
        <button id="color-btn">Сплошной цвет</button>
        <button id="gradient-btn">Градиент</button>
        <button id="image-btn">Изображение</button>
        <button id="cancel-btn">Отмена</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById('color-btn')!.onclick = () => {
        document.body.removeChild(modal);
        showColorPicker(dispatch, selected.currentSlideId);
    };

    document.getElementById('gradient-btn')!.onclick = () => {
        document.body.removeChild(modal);
        showGradientPicker(dispatch, selected.currentSlideId);
    };

    document.getElementById('image-btn')!.onclick = () => {
        document.body.removeChild(modal);
        createImageElement().then((elementImage) => {
            if (selected.currentSlideId) {
                const background: Background = { 
                    type: "picture", 
                    src: elementImage.src 
                };
                dispatch(updateSlideBackground(selected.currentSlideId, background));
            }
        });
    };

    document.getElementById('cancel-btn')!.onclick = () => {
        document.body.removeChild(modal);
    };
  };

  return {
    handleChangeBackground
  };
}
