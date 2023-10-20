export interface Game {
        player1:  {
            username: string,
            move: string,
            action: number
        },
        player2: {
            username: string,
            move: string,
            action: number
        },
        activePlayer: string,
        winner: boolean,
        gameName: string
}