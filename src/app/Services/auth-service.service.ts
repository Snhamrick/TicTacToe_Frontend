import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private apiUrl: String;

  constructor(
    private http: HttpClient,
  ) {
    this.apiUrl = environment.apiUrl;
  }

  /*API calls to server for authentication
  Login the user, Register a new user,
  Save AuthToken, Get AuthToken, Logout user by removing token,
  Function to check if user is logged in */

  public loginUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user);
  }

  public registerUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  public saveToken(token: string) {
    localStorage.setItem('auth-token', token);
  }

  public getToken(): any {
    return localStorage.getItem('auth-token');
  }

  public logoutUser() {
    localStorage.removeItem('auth-token');
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }


}
