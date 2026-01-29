import { Permission, Role } from "appwrite";
import { tablesDB } from "./client";
import { APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID } from "./config";
import { validatePresentation, type PresentationDTO } from "./presentationSchema";

function isNotFound(err: unknown) {
  return typeof err === "object" && err !== null && (err as any).code === 404;
}

const rowPerms = (userId: string) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
];

export async function savePresentation(userId: string, dto: PresentationDTO) {
  const rowId = userId;

  const data = {
    userId,
    title: dto.title,
    slides: JSON.stringify(dto.slides),
  };
  
  try {
    return await tablesDB.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID,
      rowId,
      data,
    });
  } catch (err) {
    if (isNotFound(err)) {
      return await tablesDB.createRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_TABLE_ID,
        rowId,
        data,
        permissions: rowPerms(userId),
      });
    }

    console.error("savePresentation failed:", err);
    throw err;
  }
}

export const savePresentationRow = savePresentation;

export async function loadPresentationRow(userId: string): Promise<PresentationDTO | null> {
  try {
    const row = await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID,
      rowId: userId,
    });

    const rawTitle = (row as any).title;
    const rawSlides = (row as any).slides;

    let slides: any[] = [];
    if (Array.isArray(rawSlides)) slides = rawSlides;
    else if (typeof rawSlides === "string") {
      try {
        const parsed = JSON.parse(rawSlides);
        slides = Array.isArray(parsed) ? parsed : [];
      } catch {
        slides = [];
      }
    }

    const dto: PresentationDTO = {
      title: typeof rawTitle === "string" ? rawTitle : "Без названия",
      slides,
    };

    const v = validatePresentation(dto);
    if (!v.ok) throw new Error("Презентация на сервере повреждена или устарела (не валидна).");

    return dto;
  } catch (err: any) {
    if (err?.code === 404) return null;
    if (typeof err?.type === "string" && err.type.includes("not_found")) return null;
    throw err;
  }
}
