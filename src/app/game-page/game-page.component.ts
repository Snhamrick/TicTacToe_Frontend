import { Component, ViewChild, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { Users } from 'src/Models/Users';
import { GameBoardComponent } from '../game-board/game-board.component';
import { Game } from 'src/Models/Game';
import { Move } from 'src/Models/Move';
import { Chat } from 'src/Models/Chat';
import { GameService } from '../Services/game.service';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';


@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit, DoCheck, OnDestroy {

  //Access the game board as a child
  @ViewChild(GameBoardComponent)

  /*
  Component variables
  board component, current game, current user, current move,
  opponent, playerStatus, result message, winner, draw,
  selected theme
  */
  private boardComponent: GameBoardComponent;
  public currentGame: Game;
  public currentUser: Users;
  public opponent: string;
  private playerStatus: string;
  public currentMove: Move;
  public resultMessage: any;
  public winner: any;
  public chat: Chat[];
  public draw: boolean;
  public selectedTheme: any;



  constructor(
    private gameService: GameService,
    private router: Router,
    private userService: UserService
  )
  {
    this.currentUser = {      //initialize currentUser
      username: '',
      games: 0,
      wins: 0,
      losses: 0
    }
    this.currentGame = {      //initialize currentGame
      player1: {
        username: '',
        move: '',
        action: -1
      },
      player2: {
        username: '',
        move: '',
        action: -1
      },
      activePlayer: '',
      winner: false,
      gameName: ''
    }
    this.currentMove = {    //initialize currentMove
      indicator: '',
      index: -1,
      nextPlayer: ''
    }
    this.opponent = '';       //initialize opponent
    this.playerStatus = '';   //initialize playerStatus
    this.chat = [];
    this.winner = null;
    this.boardComponent = new GameBoardComponent();
    this.draw = false;
  }


//get the logged in user and listen for socket events
ngOnInit(): void {
  this.getUser();
  this.getTheme();
  this.gameService.listen("start").subscribe((game: any) => {
    this.currentGame = game;
  });
  this.gameService.listen("move made").subscribe((move: any) => {
    this.setMove(move);
    this.currentGame.activePlayer = move.nextPlayer;
  });
  this.gameService.listen("winner").subscribe((player: any) => {
    if (this.currentUser.username === player) {
      this.resultMessage = "You have won the game!";
      this.addWin();
    } else {
      this.resultMessage = "Your opponent has won the game";
      this.addLoss();
    }
  });
  this.gameService.listen("left").subscribe((game:any) => {
    this.resultMessage = "Your opponent has left " + game.gameName;
  });
  this.gameService.listen('new chat').subscribe((chat: any) => {
    console.log(chat);
    this.chat.push(chat);
  });
  this.gameService.listen("draw").subscribe(() => {
    this.resultMessage = "The game has ended in a draw";
    this.addGame();
  });
}

//Set opponent and playerStatus after game is returned
ngDoCheck(): void {
  if (this.currentUser.username != this.currentGame.player1.username) {
    this.opponent = this.currentGame.player1.username;
    this.playerStatus = "player2";
  } else {
    this.opponent = this.currentGame.player2.username;
    this.playerStatus = "player1"
  }
}


//function to get the logged in user
  private getUser() {
    this.userService.getUser().subscribe((user: Users) => {
        this.currentUser = user;
      });
  }

  //function to add win to user
  private addWin() {
    this.userService.addWin(this.currentUser.username).subscribe((message) => {
      console.log(message);
    });
  }

  //function to add loss to user
  private addLoss() {
    this.userService.addLoss(this.currentUser.username).subscribe((message) => {
      console.log(message);
    });
  }

  //function to add game to user
  private addGame() {
    this.userService.addGame(this.currentUser.username).subscribe((message) => {
      console.log(message);
    });
  }


  //function to send move to socket
  public sendMove(index: number) {
    if (this.currentGame.activePlayer === this.currentUser.username) {
      if (this.playerStatus === "player1") {
        this.currentGame.player1.action = index;
        this.gameService.emit("new move", this.currentGame);
      } else {
        this.currentGame.player2.action = index;
        this.gameService.emit("new move", this.currentGame);
      }
    } else {
      console.log("Not your turn");
    }
  }

  //function to set move on the game board
  public setMove(move: Move) {
    this.boardComponent.setMove(move);
    this.checkWinner();
    if (this.winner != null) {
      this.gameService.emit("winner", this.currentGame);
    }
    this.checkDraw();
    if (this.draw === true) {
      this.gameService.emit("draw", this.currentGame);
    }
  }

  //function for user to leave the current game
  public leaveGame() {
    this.gameService.emit("leave game", this.currentGame);
    this.removeListeners();
    this.router.navigateByUrl('home');
  }

  //function to send chat to socket recieved from game chat
  public sendChat(chat: any) {
    let newChat = {
        gameName: this.currentGame.gameName,
        chat: chat.send,
        username: this.currentUser
    }
    this.gameService.emit("new chat", newChat);
  }

  //check the winner from the game board
  private checkWinner() {
    this.winner = this.boardComponent.checkWinner();
  }

  //function to remove all listeners
  private removeListeners() {
    this.gameService.removeListeners();
  }

  //check draw from the game board
  private checkDraw() {
    this.draw = this.boardComponent.checkDraw();
  }

  //get the users selected theme (from localstorage)
  private getTheme() {
    this.selectedTheme = this.userService.getTheme();
  }

  //remove all listeners on component destroy
  ngOnDestroy(): void {
    this.removeListeners();
  }
}







