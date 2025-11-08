import { maximalPresentation } from "./utils/tests/DataTestPresentation";

let editor = maximalPresentation;
let editorChangeHandler: (() => void) | null = null;

function getEditor() {
    return editor;
}

function setEditor(newEditor: any) {
    editor = newEditor;
}

function addEditorChangeHandler(handler: () => void) {
    editorChangeHandler = handler;
}

/**
 * 
 * @param {Function} modifyFn 
 * @param {Object} payload 
 */

function dispatch(modifyFn: any, payload: any) {
    console.log(modifyFn, payload);
    const newEditor = modifyFn(editor, payload);
    setEditor(newEditor);
    if (editorChangeHandler) {
        editorChangeHandler();
    }
}

export {
    dispatch,
    setEditor,
    getEditor,
    addEditorChangeHandler,
}