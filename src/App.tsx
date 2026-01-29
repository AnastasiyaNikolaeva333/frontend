import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "./store";

import AppwriteGate from "./view/AppwriteGate/AppwriteGate";
import EditorPage from "./view/Editor/EditorPage";
import PlayerPage from "./view/Player/PlayerPage";
import AuthPage from "./view/Auth/AuthPage";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/editor" element={
            <AppwriteGate>
              <EditorPage />
            </AppwriteGate>
          } />
          <Route path="/player" element={
            <AppwriteGate>
              <PlayerPage />
            </AppwriteGate>
          } />
          <Route path="/" element={<Navigate to="/editor" replace />} />
          <Route path="*" element={<Navigate to="/editor" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}