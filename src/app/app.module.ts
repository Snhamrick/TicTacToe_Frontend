import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { GamePageComponent } from './game-page/game-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { httpInterceptors } from './Services/httpInterceptors';
import { HomePageComponent } from './home-page/home-page.component';
import { GameChatComponent } from './game-chat/game-chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SearchSpinnerComponent } from './search-spinner/search-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    GamePageComponent,
    RegisterPageComponent,
    GameBoardComponent,
    HomePageComponent,
    GameChatComponent,
    SearchSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: httpInterceptors, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
