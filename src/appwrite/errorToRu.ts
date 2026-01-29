type AnyErr = any;

function normalizeMessage(msg: string) {
  return msg?.toLowerCase?.() ?? "";
}

export function errorToRu(err: unknown): string {
  const e: AnyErr = err ?? {};
  const code: number | undefined = e.code;
  const type: string | undefined = e.type;
  const message: string = e.message ?? "Неизвестная ошибка";

  const m = normalizeMessage(message);

  if (m.includes("creation of a session is prohibited when a session is active")) {
    return "Вы уже вошли в аккаунт. Выйдите из текущей сессии и попробуйте снова.";
  }
  if (m.includes("failed to fetch")) {
    return "Не удалось подключиться к серверу. Проверьте интернет и настройки Appwrite (endpoint, projectId).";
  }
  if (m.includes("invalid url")) {
    return "Неверно указан адрес Appwrite (VITE_APPWRITE_ENDPOINT). Проверьте .env и перезапустите dev-сервер.";
  }
  if (m.includes("row with the requested id") && m.includes("could not be found")) {
    return "Презентация для этого пользователя ещё не создана. Будет создана новая.";
  }

  if (type === "user_invalid_credentials" ) return "Неверный email или пароль.";
  if (type === "user_already_exists") return "Пользователь с таким email уже зарегистрирован.";

  if (code === 401) return "Нет доступа (401). Войдите в аккаунт или проверьте права в Appwrite.";
  if (code === 403) return "Доступ запрещён (403). Проверьте права (Permissions) в базе/бакете.";
  if (code === 404) return "Ресурс не найден (404). Возможно, таблица/строка/бакет не существует.";
  if (code === 409) return "Конфликт (409). Возможно, пользователь уже существует.";
  if (code === 400) return "Некорректный запрос (400). Проверьте введённые данные.";

  return message;
}
