import React, { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../../appwrite/authService";
import { loadPresentationRow, savePresentationRow } from "../../appwrite/presentationService";
import { useAutoSavePresentation } from "../../utils/hooks/useAutoSavePresentation";
import { useAppDispatch } from "../../utils/hooks/redux";
import { restoreState } from "../../store/slice/presentationSlice";
import { selectSlide } from "../../store/slice/selectedSlice";
import { setSessionUserId } from "../../appwrite/session";
import { createNewSlide } from "../../utils/function/functionCreateElements";
import { useLocation } from "react-router-dom";
import { LoadingSplash } from "../Common/LoadingSplash";
import { errorToRu } from "../../appwrite/errorToRu";
import { Navigate } from "react-router-dom";
import styles from "./AppwriteGate.module.css";
import style from "../Presentation/HeadPresentation.module.css"
import { MyButton } from "../Button/Buttons";

type Props = { children: React.ReactNode };

export default function AppwriteGate({ children }: Props) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const isPlayerPage = location.pathname === "/player";

  useAutoSavePresentation(userId, hydrated);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted || !isOnline) return;

      try {
        const user = await getCurrentUser();
        if (!isMounted) return;

        setUserId(user.$id);
        setSessionUserId(user.$id);

        const dto = await loadPresentationRow(user.$id);

        if (dto?.slides?.length) {
          dispatch(restoreState({
            title: dto.title,
            slides: dto.slides
          }));
          dispatch(selectSlide([dto.slides[0].id]));
        } else {
          const newSlide = createNewSlide();
          const newPresentation = {
            title: "Новая презентация",
            slides: [newSlide],
          };

          dispatch(restoreState({
            title: newPresentation.title,
            slides: newPresentation.slides
          }));
          dispatch(selectSlide([newSlide.id]));

          await savePresentationRow(user.$id, newPresentation);
        }

        setHydrated(true);
        setReady(true);

      } catch (err: any) {
        if (!isMounted) return;

        const errorMsg = err?.message?.toLowerCase() || '';
        if (errorMsg.includes('network') || errorMsg.includes('failed') || errorMsg.includes('fetch')) {
          setIsOnline(false);
        } else {
          setLoadError(errorToRu(err));
          setUserId(null);
          setReady(true);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [dispatch, isOnline]);

  if (!isOnline) {
    return <LoadingSplash text="Проверка подключения к серверу…" />;
  }

  if (!ready) {
    return <LoadingSplash text="Загрузка презентации…" />;
  }

  const handleLogout = async () => {
    await logout();
    setUserId(null);
    setSessionUserId(null);
    setHydrated(false);
    window.location.href = "/login";
  };

  if (!userId && loadError) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {loadError && (
        <div className={styles.errorContainer}>{loadError}</div>
      )}
      {!isPlayerPage && (
        <div className={styles.logoutContainer}>
          <MyButton
            onClick={handleLogout}
            title="Выйти из аккаунта"
          >
            <img
              className={style.logoIcon}
              src="src/assets/exit.jpg"
              alt="Логотип"
            />
            <span>Выход</span>
          </MyButton>
        </div>
      )}
      {children}
    </>
  );
}