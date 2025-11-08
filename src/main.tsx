import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { addEditorChangeHandler, getEditor } from "./editor";

function render() {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App editor={getEditor()} />
        </StrictMode>,
    )
}

addEditorChangeHandler(render);
render();

