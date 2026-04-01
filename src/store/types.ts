import { GameModel } from "../models/game.model";
import { LeaderboardEntity } from "../models/models-types";
import { UserModel } from "../models/user.model";

export interface GameStore {
  users: UserModel[];
  games: GameModel[];
  currentGame: GameModel | null;
  completedGames: GameModel[];
  leaderboard: LeaderboardEntity[];
  isLoading: boolean;
  loadingMessage: string | null;

  fetchUsers: () => Promise<void>;
  fetchGames: (background?: boolean, signal?: AbortSignal) => Promise<void>;
  createGame: (mode: "AI" | "PVP") => Promise<GameModel | null>;
  joinGame: (uuid: string) => Promise<GameModel | null>;
  getGameById: (
    uuid: string,
    background?: boolean,
    signal?: AbortSignal
  ) => Promise<GameModel | null>;
  updateGameById: (
    uuid: string,
    coords: { row: number; col: number }
  ) => Promise<GameModel | null>;
  fetchCompleted: () => Promise<void>;
  fetchLeaderboard: (count?: number) => Promise<void>;
  clearData: () => Promise<boolean>;
}

export interface RequestConfig {
  url: string;
  method?: "GET" | "POST" | "DELETE";
  signal?: AbortSignal;
  data?: unknown;
  params?: unknown;
  showLoading?: boolean;
  loadingLabel?: string;
  resetState?: () => void;
}

export type RequestResult<T> = { data: T; error: null } | { data: null; error: string };
