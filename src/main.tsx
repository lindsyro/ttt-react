import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";

import App from "./App";
import { ActiveGame } from "./pages/ActiveGame";
import { GameCreate } from "./pages/GameCreate";
import { Games } from "./pages/Games";
import { History } from "./pages/History";
import { Leaderboard } from "./pages/Leaderboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

import "./index.css";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/games" replace />,
      },
      {
        path: "login",
        element: <Login />,
        handle: { title: "Авторизация" },
      },
      {
        path: "signup",
        element: <Register />,
        handle: { title: "Регистрация" },
      },
      {
        path: "games",
        element: <Games />,
      },
      {
        path: "create",
        element: <GameCreate />,
      },
      {
        path: "users/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "games/history",
        element: <History />,
      },
      {
        path: "games/:uuid",
        element: <ActiveGame />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Не удалось найти элемент с id "root". Проверь свой index.html!'
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
