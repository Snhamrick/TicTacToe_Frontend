import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-game-chat',
  templateUrl: './game-chat.component.html',
  styleUrls: ['./game-chat.component.scss']
})
export class GameChatComponent {

  /*Recieve chat input from game page
  Output when a new chat is sent to the game page */
  @Input('chat') chat: any;
  @Output() newChat = new EventEmitter<any>()
  constructor(
    private formBuilder: FormBuilder,
  ) {}

  //generat chat form
  public chatForm = this.formBuilder.group({
    send: ['', Validators.required]
  });

  //function to send chat, send chatForm value to game page
  public sendChat() {
    this.newChat.emit(this.chatForm.value);
    this.chatForm.patchValue({
      send: ''
    });
  }

}
