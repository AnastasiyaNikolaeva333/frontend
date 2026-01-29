import React, { useState } from "react";
import { login, register } from "../../appwrite/authService";
import { errorToRu } from "../../appwrite/errorToRu";
import styles from "./AuthPage.module.css";
import { MyButton } from "../Button/Buttons";
import { useNavigate } from "react-router-dom"; 
import { setSessionUserId } from "../../appwrite/session"; 

export default function AuthPage() { 
  const navigate = useNavigate(); 
  
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const user =
        mode === "login"
          ? await login(email, password)
          : await register(email, password, name);

      setSessionUserId(user.$id);
      navigate("/editor", { replace: true });
      
    } catch (err: any) {
      setError(errorToRu(err));
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <span className={styles.title}>Авторизация пользователя</span>
        <div className={styles.tabs}>
          <MyButton
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            text="Вход"
            disabled={mode === "login"}
            className={`${styles.tab} ${mode === "login" ? styles.active : ""}`}
          />
          <MyButton
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            text="Регистрация"
            disabled={mode === "register"}
            className={`${styles.tab} ${mode === "register" ? styles.active : ""}`}
          />
        </div>

        <form onSubmit={submit} className={styles.form}>
          {mode === "register" && (
            <input
              className={styles.input}
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className={styles.passwordWrapper}>
            <input
              className={styles.input}
              placeholder="Пароль (минимум 8 символов)"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <MyButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.showPasswordBtn}
              style={{ background: "transparent", border: "none" }}
            >
              {showPassword ? "👀" : "👁"}
            </MyButton>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <MyButton
            type="submit"
            onClick={() => { }}
            text={mode === "login" ? "Вход" : "Создать аккаунт"}
            className={styles.submit}
            variant="primary"
          />
        </form>
      </div>
    </div>
  );
}