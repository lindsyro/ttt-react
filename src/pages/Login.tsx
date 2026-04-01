import { useActionState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { useUiStore } from "../store/useUiStore";

export const Login = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { globalError, setError, globalSuccess } = useUiStore();

  const loginAction = async (
    _prevState: { login: string },
    formData: FormData
  ): Promise<{ login: string }> => {
    const login = formData.get("login") as string;
    const password = formData.get("password") as string;

    if (login.trim().length < 3) {
      setError("Логин слишком короткий");
      return { login };
    }

    if (password.trim().length < 8) {
      setError("Пароль слишком короткий");
      return { login };
    }

    try {
      await authStore.login({ login, password });
      navigate("/games");
      return { login: "" };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ошибка входа";
      setError(message);
      return { login };
    }
  };

  const [state, formAction, isPending] = useActionState(loginAction, {
    login: localStorage.getItem("username") || "",
  });

  return (
    <div className="container">
      <form
        action={formAction}
        className="auth-form"
        onInput={() => globalError && setError(null)}
      >
        <div className="auth-fields">
          <input
            name="login"
            key={`login-field-${state?.login}`}
            defaultValue={state?.login}
            type="text"
            placeholder="Логин"
            required
            autoComplete="username"
            disabled={isPending}
          />
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            autoComplete="current-password"
            required
            disabled={isPending}
          />
        </div>

        {isPending && (
          <div className="loader animate-pulse">{authStore.loadingMessage}</div>
        )}

        <div className="button-group">
          <button type="submit" disabled={isPending} className="btn">
            Войти
          </button>
          <button
            onClick={() => navigate("/signup")}
            type="button"
            className="btn"
            disabled={isPending}
          >
            Регистрация
          </button>
        </div>

        {globalError && (
          <div className="status-message error">{globalError}</div>
        )}

        {globalSuccess && (
          <div className="status-message success">{globalSuccess}</div>
        )}
      </form>
    </div>
  );
};
