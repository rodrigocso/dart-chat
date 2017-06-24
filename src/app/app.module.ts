import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UserComponent } from './components/user.component';
import { MessagesComponent } from './components/messages.component';
import { SendMessageComponent } from './components/send-message.component';
import { SendImageComponent } from './components/send-image.component';
import { UserService } from './services/user.service';
import { MessagesService } from './services/messages.service';
import { StorageService } from './services/storage.service';
import { AutoScrollDirective } from './directives/auto-scroll.directive';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MessagesComponent,
    SendMessageComponent,
    SendImageComponent,
    AutoScrollDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    UserService,
    MessagesService,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
