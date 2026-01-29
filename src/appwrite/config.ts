function readStringEnv(name: string): string {
  const raw = (import.meta.env as any)[name] as string | undefined;
  if (!raw) {
    throw new Error(
      `Отсутствует переменная окружения: ${name}. Добавьте её в корневой файл .env и перезапустите npm run dev.`,
    );
  }

  const value = String(raw)
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1");

  if (!value) {
    throw new Error(`Отсутствует переменная окружения: ${name}`);
  }

  return value;
}

function readUrlEnv(name: string): string {
  const value = readStringEnv(name);
  try {
    new URL(value);
  } catch {
    throw new Error(
      `Недопустимый URL-адрес в ${name}: "${value}". Должен быть: http://localhost/v1 or https://xxx.appwrite.io/v1`,
    );
  }
  return value;
}

export const APPWRITE_ENDPOINT = readUrlEnv("VITE_APPWRITE_ENDPOINT"); 
export const APPWRITE_PROJECT_ID = readStringEnv("VITE_APPWRITE_PROJECT_ID"); 

export const APPWRITE_DATABASE_ID = readStringEnv("VITE_APPWRITE_DATABASE_ID");
export const APPWRITE_TABLE_ID = readStringEnv("VITE_APPWRITE_TABLE_ID");

export const APPWRITE_BUCKET_ID = readStringEnv("VITE_APPWRITE_BUCKET_ID");
