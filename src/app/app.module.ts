import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ContextModule } from './context/context.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ContextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
