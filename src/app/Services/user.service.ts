import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Users } from 'src/Models/Users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }



   /*API Methods
  GetUser, AddWin, AddLoss, AddGame
  */
  public getUser() {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }

  public addWin(username: string) {
    return this.http.put<any>(`${this.apiUrl}/win`, {username: username});
  }

  public addLoss(username: String) {
    return this.http.put<any>(`${this.apiUrl}/loss`, {username:username});
  }

  public addGame(username: String) {
    return this.http.put<any>(`${this.apiUrl}/games`, {username: username});
  }

  /*User Theme Service Methods
  SaveTheme, GetTheme
  */

  public saveTheme(theme: string) {
    localStorage.setItem("theme", theme);
  }

  public getTheme() {
     return localStorage.getItem("theme");
  }

}
