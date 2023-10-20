import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService  {

  public socket: any;
  readonly socketUrl: string = environment.socketUrl;

  //Set the socket URL
  constructor() {
    this.socket = io(this.socketUrl);
  }



  /*Web Socket Methods
  Listen for events from server
  Emit events to server
  Remove all listeners */

  public listen(event: String) {
    return new Observable((subscriber) => {
      this.socket.on(event, (data: any) => {
        subscriber.next(data);
      })
    });
  }

  public emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  public removeListeners() {
    this.socket.removeAllListeners();
  }

  public removeNoneListener() {
    this.socket.off("none found");
  }

}
