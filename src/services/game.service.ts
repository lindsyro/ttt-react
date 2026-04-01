import { GameModel } from "../models/game.model"

export class GameService {
  static getStatusLabel(game: GameModel, currentUserId: string): string {
    const state = game.state

    switch (state.status) {
      case 'WAITING':
        return 'Ожидание игроков'

      case 'PLAYING': {
        if (state.playerUUID === currentUserId) {
          return 'Ваш ход'
        }
        
        const activePlayer = game.creator.uuid === state.playerUUID ? game.creator : game.opponent
        
        return `Ходит соперник ${activePlayer?.login || '...'}`
      }

      case 'WON':
        return state.playerUUID === currentUserId ? 'Победа!' : 'Поражение'

      case 'DRAW':
        return 'Ничья'

      default:
        return ''
    }
  }

  static getHistoryStatus(game: GameModel, currentUserId: string): string {
    const { status, playerUUID } = game.state;

    if (status === 'DRAW') return 'НИЧЬЯ';
    if (status === 'WON') {
      return playerUUID === currentUserId ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ';
    }
    return 'ЗАВЕРШЕНО';
  }

  static getOpponentLogin(game: GameModel, currentUserId: string): string {
    return game.creator.uuid === currentUserId
      ? game.opponent?.login || "Ожидание"
      : game.creator.login;
  }
}
