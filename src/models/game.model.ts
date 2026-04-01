import type { GameResponseDTO, GameState } from "./models-types";

import { BoardModel } from "./board.model";
import { UserModel } from "./user.model";

export class GameModel {
  public uuid: string;
  public createdAt: string;
  public board: BoardModel;
  public state: GameState;
  public creator: UserModel;
  public opponent: UserModel | null;

  constructor(data: GameResponseDTO) {
    this.uuid = data.uuid;
    this.createdAt = data.createdAt;
    this.board = new BoardModel(data.board);
    this.state = data.state;
    this.creator = new UserModel(data.creator);
    this.opponent = data.opponent ? new UserModel(data.opponent) : null;
  }

  isMyTurn(currentUserId: string | null): boolean {
    return (
      this.state.status === "PLAYING" && this.state.playerUUID === currentUserId
    );
  }
}
