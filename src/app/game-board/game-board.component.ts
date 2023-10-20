import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Move } from 'src/Models/Move';


@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  //array variable for game squares
  public squares: any;

  //output click event to game page
  @Output() newMove = new EventEmitter<number>()
  constructor() {
    this.squares = new Array(9).fill(null);
  }

  //reset te game when component initializes
  ngOnInit(): void {
    this.resetGame();
  }

  //select move function sends move to game page
  public selectMove(index: number) {
    if (!this.squares[index]) {
      this.newMove.emit(index);
    }
  }

  //set the move with move parameter
  public setMove(move: Move) {
    this.squares[move.index] = move.indicator;
  }

   //Function to check winning combinations
  public checkWinner() {
    let wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [0, 4, 8]
    ];

    //cycle through winning combinations
    for (let i=0; i < wins.length; i++) {
      let [a, b, c] = wins[i];
      if (this.squares[a] && this.squares[a] === this.squares[b] && this.squares[a] === this.squares[c]) {
        console.log(this.squares);
        return this.squares[a];
      }
    }
    return null;
  }

  //function to check if all of the squares are filled to determine draw
  public checkDraw() {
    let filled = 0;
    for (let i=0; i < this.squares.length; i++) {
      if (this.squares[i] != null) {
        filled++
      }
      if (filled === 9) {
        return true;
      }
    }
    return false;
  }

  //reset game function
  public resetGame() {
    for (let i=0; i < this.squares.length; i++) {
      this.squares[i] = null;
    }
  }
}
