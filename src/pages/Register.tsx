import { useActionState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { useUiStore } from "../store/useUiStore";

export const Register = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { globalError, setError, setSuccess } = useUiStore();

  const signupAction = async (
    _prevState: { login: string },
    formData: FormData
  ): Promise<{ login: string }> => {
    const login = formData.get("login") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (login.trim().length < 3) {
      setError("Логин слишком короткий");
      return { login };
    }

    if (password.trim().length < 8) {
      setError("Пароль должен быть не менее 8 символов");
      return { login };
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return { login };
    }

    try {
      await authStore.signup({ login, password });
      setSuccess("Регистрация прошла успешно! Теперь войдите.", 10000);
      navigate("/login");
      return { login };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Ошибка регистрации";
      setError(message);
      return { login };
    }
  };

  const [state, formAction, isPending] = useActionState(signupAction, {
    login: "",
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
            key={`reg-login-${state?.login}`}
            name="login"
            defaultValue={state?.login}
            type="text"
            placeholder="Логин"
            autoComplete="username"
            required
            disabled={isPending}
          />

          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Пароль"
            required
            disabled={isPending}
          />

          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Повторите пароль"
            required
            disabled={isPending}
          />
        </div>

        {isPending && (
          <div className="loader animate-pulse">{authStore.loadingMessage}</div>
        )}

        <div className="button-group">
          <button type="submit" disabled={isPending} className="btn">
            Зарегистрироваться
          </button>
        </div>

        {globalError && (
          <div className="status-message error">{globalError}</div>
        )}
      </form>
    </div>
  );
};
