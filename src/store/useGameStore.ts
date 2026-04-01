import { create } from "zustand";

import { GameModel } from "../models/game.model";
import {
  GameResponseDTO,
  LeaderboardEntity,
  UserDTO,
} from "../models/models-types";
import { UserModel } from "../models/user.model";

import { GameStore } from "./types";
import { performRequest } from "./utils";

export const useGameStore = create<GameStore>((set) => ({
  users: [],
  games: [],
  currentGame: null,
  completedGames: [],
  leaderboard: JSON.parse(localStorage.getItem("leaderboard_cache") || "[]"),
  isLoading: false,
  loadingMessage: null,

  fetchUsers: async () => {
    const { data } = await performRequest<UserDTO[]>({ url: "web/users" }, set);
    if (data) set({ users: data.map((u) => new UserModel(u)) });
  },

  fetchGames: async (background = false, signal) => {
    const { data } = await performRequest<GameResponseDTO[]>(
      {
        url: "web/games",
        loadingLabel: "Загрузка списка доступных игр...",
        resetState: background ? undefined : () => set({ games: [] }),
        showLoading: !background,
        signal,
      },
      set
    );
    if (data) set({ games: data.map((g) => new GameModel(g)) });
  },

  createGame: async (mode) => {
    const { data } = await performRequest<GameResponseDTO>(
      {
        url: "web/games",
        method: "POST",
        data: { mode },
        loadingLabel: "Создание новой игры...",
      },
      set
    );
    return data ? new GameModel(data) : null;
  },

  joinGame: async (uuid) => {
    const { data } = await performRequest<GameResponseDTO>(
      {
        url: `web/games/${uuid}/join`,
        method: "POST",
        showLoading: false,
      },
      set
    );
    if (!data) return null;
    const game = new GameModel(data);
    set({ currentGame: game });
    return game;
  },

  getGameById: async (uuid, background = false, signal) => {
    const { data } = await performRequest<GameResponseDTO>(
      {
        url: `web/games/${uuid}`,
        method: "GET",
        showLoading: !background,
        signal,
        resetState: background ? undefined : () => set({ currentGame: null }),
      },
      set
    );
    if (!data) return null;
    const game = new GameModel(data);
    set({ currentGame: game });
    return game;
  },

  updateGameById: async (uuid, coords) => {
    const { data } = await performRequest<GameResponseDTO>(
      {
        url: `web/games/${uuid}`,
        method: "POST",
        data: { row: coords.row, col: coords.col },
        showLoading: false,
      },
      set
    );
    if (!data) return null;
    const game = new GameModel(data);
    set({ currentGame: game });
    return game;
  },

  fetchCompleted: async () => {
    const { data } = await performRequest<GameResponseDTO[]>(
      { url: "web/games/completed", loadingLabel: "Загрузка истории игр..." },
      set
    );
    if (data) set({ completedGames: data.map((g) => new GameModel(g)) });
  },

  fetchLeaderboard: async (count = 20) => {
    const { data } = await performRequest<LeaderboardEntity[]>(
      {
        url: "web/users/leaderboard",
        method: "GET",
        params: { count },
        loadingLabel: "Загрузка рейтинга игроков...",
      },
      set
    );

    if (data) {
      set({ leaderboard: data });
      localStorage.setItem("leaderboard_cache", JSON.stringify(data));
    } else {
      set({ leaderboard: [] });
      localStorage.removeItem("leaderboard_cache");
    }
  },

  clearData: async () => {
    const { error } = await performRequest(
      {
        url: "web/games",
        method: "DELETE",
        loadingLabel: "Очистка данных...",
      },
      set
    );

    if (error) return false;

    set({ games: [], currentGame: null, completedGames: [] });
    return true;
  },
}));
