import { useEffect, useRef } from "react";
import { useAppSelector } from "./redux";
import { selectPresentationTitle, selectSlides } from "../../store";
import { savePresentationRow } from "../../appwrite/presentationService";
import type { PresentationDTO } from "../../appwrite/presentationSchema";

export function useAutoSavePresentation(userId: string | null, enabled: boolean) {
  const title = useAppSelector(selectPresentationTitle);
  const slides = useAppSelector(selectSlides);

  const timerRef = useRef<number | null>(null);
  const lastSavedRef = useRef<string>("");

  useEffect(() => {
    if (!userId || !enabled) return;

    const dto: PresentationDTO = { title, slides };
    const payloadString = JSON.stringify(dto);

    if (payloadString === lastSavedRef.current) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      await savePresentationRow(userId, dto);
      lastSavedRef.current = payloadString;
    }, 800);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [userId, enabled, title, slides]);
}
