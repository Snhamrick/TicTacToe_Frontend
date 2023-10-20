import { Component, OnInit, OnDestroy } from '@angular/core';
import { Users } from 'src/Models/Users';
import { Game } from 'src/Models/Game';
import { GameService } from '../Services/game.service';
import { UserService } from '../Services/user.service';
import { AuthServiceService } from '../Services/auth-service.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {

  /*
  Vaiables for current user, current game, and selected theme, searching
  */
  public currentUser: Users;
  public currentGame: Game;
  public selectedTheme: any;
  public searching: boolean;
  public noneMessage: any;
  //Array for list of themes
  public themeArray = [
    'default',
    'dark',
    'light',
    'modern',
    'colorful'
  ]

  constructor(
    private gameService: GameService,
    private router: Router,
    private authService: AuthServiceService,
    private userService: UserService,

  ) {
    this.currentUser = {
      username: '',
      games: 0,
      wins: 0,
      losses: 0
    }
    this.currentGame = {
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
    this.searching = false;
  };


  //Initialize: getUser, set theme, and listen to web socket
  ngOnInit(): void {
    this.getUser();
    this.getTheme();
    this.gameService.listen("connected").subscribe((res: any) => {
      console.log(res);
      });

    this.gameService.listen("found game").subscribe((game: any) => {
      if (game) {
        this.currentGame = game;
        this.router.navigateByUrl('tictactoe');
      }
    });
  }

  //get the current user information
  private getUser() {
    this.userService.getUser().subscribe((user: Users) => {
      this.currentUser = user;
    });
  }

  //emit to web socket to join game
  public joinGame() {
    this.gameService.emit("join game", this.currentUser.username);
    this.searching = true;
    this.noneMessage = null;
    //listen for no other player response
    this.gameService.listen("none found").subscribe((res: any) => {
      this.noneMessage = res;
      this.searching = false;
      //remove the no other player listener once revieved
      this.gameService.removeNoneListener();
    });
  }

  //log the current user out and return to login
  public logout() {
    this.authService.logoutUser();
    this.router.navigateByUrl('');
  }

  //change the theme and save within the browser
  public changeTheme(event: any) {
    this.selectedTheme = event.target.value;
    this.userService.saveTheme(this.selectedTheme);
  }

  //get the selected theme from the browser
  private getTheme() {
    this.selectedTheme = this.userService.getTheme();
  }

  //start the game on destroy
  ngOnDestroy(): void {
    this.gameService.emit("start", this.currentGame);
    this.gameService.removeListeners();
  }

}
